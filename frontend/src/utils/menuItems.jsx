import { dashboard,expenses,trend,cont,chat } from "./Icons";
export const menuItems = [
    {
        id:1,
        title:'Dashboard',
        icon: dashboard,
        link:'/dashboard',
    },

    {
        id:2,
        title:'Incomes',
        icon: trend,
        link:'/dashboard',
    },
    {
        id:3,
        title:'Expenses',
        icon:expenses,
        link:'/dashboard',
    },
    {
        id:4,
        title: 'chatbot',
        icon:chat,
        link:'/dashboard',
        
    },
    {
        id:5,
        title:'contact us',
        icon: cont,
        link:'/dashboard',
    },

]