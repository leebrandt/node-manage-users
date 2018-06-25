const express = require('express')
const router = express.Router()

// These are the basic field definitions - the values will be populated on demand
const fields = [
  // Required fields
  { label: 'First Name', name: 'firstName', required: true },
  { label: 'Last Name', name: 'lastName', required: true },

  // Some built-in attributes
  { label: 'Address', name: 'streetAddress' },
  { label: 'City', name: 'city' },
  { label: 'State', name: 'state' },
  { label: 'Zip Code', name: 'zipCode' },

  // Custom attributes
  { label: 'Birthday', name: 'birthdDate', type: 'date' }, // Custom `date` type
  { label: 'Favorite Color', name: 'favoriteColor' },
]

/* This will update the user's profile on submit
 * It's only called for POST requests
 */
router.post('/', async (req, res, next) => {
  try {
    // Assign the values from the form to the user profile
    Object.assign(req.user.profile, req.body)

    // Send a request to Okta to update the user profile
    // This also updates the cache in Node, to avoid excess server requests
    await req.user.update()
  } catch (error) {
    console.log(error)
  }

  next() // Move on to the next route handler, below
})

// This will be called on all requests
router.use('/', (req, res, next) => {
  res.render('profile', {
    title: 'Profile',
    user: req.user,

    // create new objects containing the field data with the user's profile info
    fields: fields.map(field => ({
      // this es6 syntax copies the values from the field into the new object
      ...field,

      // pull the value from the user profile and add it to the field object
      value: req.user.profile[field.name],
    })),
  })
})

module.exports = router