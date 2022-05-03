import { Router } from 'wxapp-router';
const router = new Router();
router.register({
    path:'/list',
    route:'/miniprogram/pages/listPage/listPage'
})

router.register({
  path:'/index',
  route:'/miniprogram/pages/index/index'
})

router.register({
  path:'/search',
  route:'/miniprogram/pages/searchPage/searchPage'
})


export default router