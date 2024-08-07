const { postQuery, getQueries, getJobs, postJob, getApplicants } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();


const { register, verifyOtp, login, getUser } = require('../Controllers/AuthController');
const authMiddleware = require('../Middlewares/AuthMiddleware');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);


// router.post('/login', loginValidation, login);
// router.post('/signup', signupValidation, signup);
router.post('/post-query', postQuery);
router.post('/post-job', postJob);


router.get('/get-queries', getQueries);
router.get('/get-jobs', getJobs);
router.get('/get-applicants', getApplicants);

module.exports = router;