const auth = require('../auth')
const express = require('express')
const Top5ListController = require('../controllers/top5list-controller')
const UserController = require('../controllers/user-controller')
const PublishedTop5ListController = require('../controllers/PublishedTop5List-controller')
const router = express.Router()

router.post('/top5list', auth.verify, Top5ListController.createTop5List)
router.put('/top5list/:id', auth.verify, Top5ListController.updateTop5List)
router.delete('/top5list/:id', auth.verify, Top5ListController.deleteTop5List)
router.get('/top5list/:id', auth.verify, Top5ListController.getTop5ListById)
router.get('/top5lists', auth.verify, Top5ListController.getTop5Lists)
router.get('/top5listpairs', auth.verify, Top5ListController.getTop5ListPairs)

router.post('/register', UserController.registerUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.post('/login', UserController.login)
router.get(`/logout/`, UserController.getLoggedOut)
router.put('/user/:id', auth.verify, UserController.updateUser)
router.get('/user', UserController.getAllUserTop5Lists)

router.post('/publishedTop5Lists',auth.verify, PublishedTop5ListController.createTop5List)
router.get('/publishedTop5Lists', PublishedTop5ListController.getTop5Lists)
router.delete('/publishedTop5Lists/:id', auth.verify, PublishedTop5ListController.deleteTop5List)
router.put('/publishedTop5Lists/:id', PublishedTop5ListController.updateTop5List)
router.get('/publishedTop5Lists', PublishedTop5ListController.getTop5ListPairs)






module.exports = router