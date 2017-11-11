/* Do not store secret key this way in production */
const jwtsecret = 'mysecretkey1';
const YELP_TOKEN = '';

const api = require('koa-router')();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Venue = require('../models/venue');
const utils = require('../helpers/utils');
const axios = require('axios');

const NodeCache = require('node-cache');
const myCache = new NodeCache();

function createJWT(user) {
  const payload = {
    id: user.id,
    displayName: user.displayName,
    email: user.email
  };
  return jwt.sign(payload, jwtsecret);
}

async function getVenuesByAuthor(user) {
  return await Venue.find({
    user_account: user
  });
}

async function getUserByEmail(email) {
  return await User.findOne({
    email: email
  });
}

function isUserAuthorized(header) {
  try {
    const token = header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtsecret);
    return decoded;
  } catch (err) {
    return !err;
  }
}

async function addMeetingParticipant(record) {
  const newParticipant = new Venue(record);
  await newParticipant.save();
}

async function cancelMeeting(record) {
  await Venue.remove({
    user_account: record.user_account,
    business_id: record.business_id
  });
}

async function cancelAllMeetings(record) {
  await Venue.remove({
    user_account: record.user_account
  });
}

function getVenuesInArea(lat, lon) {
  const term = 'bars';
  const yelpApi = 'https://api.yelp.com/v3/businesses/search?'
    + `term=${term}&latitude=${lat}&longitude=${lon}`;
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      headers: {
        'Authorization': YELP_TOKEN
      },
      url: yelpApi
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function getVenuesVisitors(neededPlaces) {
  const allPlacesVisitors = await Venue.aggregate([
    {
      $group: {
        _id: '$business_id',
        count: {$sum: 1}
      }
    }
  ]);
  const neededPlacesVisitors = allPlacesVisitors.filter(el => {
    return neededPlaces.indexOf(el['_id']) > -1;
  });
  return Object.assign(
    {},
    ...neededPlacesVisitors.map(el => ({[el['_id']]: el.count}))
  );
}
// ############################################################################
// #                                 GET                                      #
// ############################################################################
api.get('/nearest-venues', async ctx => {
  try {
    if (!utils.validateLocationParams(ctx.query)) {
      throw 'Invalid location.';
    }
    const lat = ctx.query.lat;
    const lon = ctx.query.lon;
    const memKey = `lat=${lat}&lon=${lon}`;
    let data;
    const val = myCache.get(memKey);
    if (val == undefined) {
      data = await getVenuesInArea(lat, lon);
      myCache.set(memKey, data, 10000);
    } else {
      data = val;
    }
    const venuesList = data.businesses.map(el => el.id);
    const visitors = await getVenuesVisitors(venuesList);
    data = Object.assign({}, data, {visitors: visitors});
    const decoded = isUserAuthorized(ctx.request.header);
    if (decoded) {
      const venues = await getVenuesByAuthor(decoded.email);
      const businesses= venues.map(el => el['business_id']);
      data = Object.assign({}, data, {my_venues: businesses});
    }
    // Delay for local testing
    // await (function delayTest(ms) {
    //   return new Promise(resolve => setTimeout(resolve, ms));
    // })(10000);
    ctx.body = data;
  } catch (err) {
    ctx.body = err;
    ctx.status = 500;
  }
});

// ############################################################################
// #                                POST                                      #
// ############################################################################
api.post('/user', async ctx => {
  if (!utils.validateRegistrationData(ctx.request.body)) {
    return ctx.status = 400;
  }
  try {
    await User.create(ctx.request.body);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 422;
  }
});

api.post('/login', async ctx => {
  const email = ctx.request.body.email;
  const password = ctx.request.body.password;
  const user = await getUserByEmail(email);

  if (user && user.checkPassword(password)) {
    ctx.body = {
      user: user.displayName,
      token: 'JWT ' + createJWT(user)
    };
  } else {
    ctx.status = 401;
  }
});

api.post('/add-venue', async ctx => {
  try {
    const decoded = isUserAuthorized(ctx.request.header);
    if (!decoded) throw 'Authorization error';
    const record = {
      business_id: ctx.request.body.business_id,
      user_account: decoded.email
    };
    await addMeetingParticipant(record);
    const venues = await getVenuesByAuthor(decoded.email);
    ctx.body = venues.map(el => el['business_id']);
    ctx.status = 201;
  } catch (err) {
    ctx.status = 401;
  }
});

api.post('/cancel-venue', async ctx => {
  try {
    const decoded = isUserAuthorized(ctx.request.header);
    if (!decoded) throw 'Authorization error';
    const record = {
      business_id: ctx.request.body.business_id,
      user_account: decoded.email
    };
    await cancelMeeting(record);
    const venues = await getVenuesByAuthor(decoded.email);
    ctx.body = venues.map(el => el['business_id']);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 401;
  }
});

api.post('/cancel-all', async ctx => {
  try {
    const decoded = isUserAuthorized(ctx.request.header);
    if (!decoded) throw 'Authorization error';
    const record = {
      user_account: decoded.email
    };
    await cancelAllMeetings(record);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 401;
  }
});

module.exports = api;
