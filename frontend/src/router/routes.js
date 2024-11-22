import About from "../pages/About"
import FriendsPage from "../pages/Friends"
import FriendInvites from "../pages/Invites"
import Login from "../pages/Login"
import Posts from "../pages/Posts"
import PostShow from "../pages/PostShow"
import Profile from "../pages/Profile"
import Registration from "../pages/Registration"
import Search from "../pages/Search"

export const privateRoutes = [
    {path: '/about', component: About, exact: true},
    {path: '/posts', component: Posts, exact: true},
    {path: '/posts/:id', component: PostShow, exact: true},
    {path: '/profile/:id', component: Profile, exact: true},
    {path: '/search', component: Search, exact: true},
    {path: '/friends', component: FriendsPage, exact: true},
    {path: '/invites', component: FriendInvites, exact: true},
]

export const publicRoutes = [
    {path: '/login', component: Login, exact: true},
    {path: '/registration', component: Registration, exact: true},
    {path: '/about', component: About, exact: true},
]