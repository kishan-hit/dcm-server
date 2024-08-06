const { signup, login, postQuery, getQueries, getJobs, postJob } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/post-query', postQuery);
router.post('/post-job', postJob);


router.get('/get-queries', getQueries);
router.get('/get-jobs', getJobs);

module.exports = router;