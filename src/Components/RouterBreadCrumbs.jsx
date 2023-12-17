import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {
    Link as RouterLink,
    useLocation,
} from 'react-router-dom';

const breadcrumbNameMap = {
    '/courses': 'دوره ها',
    '/courses/': 'مشخصات دوره',
    '/teachers': 'اساتید',
    '/edit-profile': 'ویرایش پروفایل',
    '/teachers/courses': 'دوره های استاد',
    '/teachers/courses/': 'مدیریت دوره',
    '/teachers/courses//chat-room': 'چت با دانشجویان دوره',
    '/teachers/courses//sections': 'جلسات دوره',
    '/teachers/courses//sections/': 'مدیریت جلسه',
    '/teachers/courses//sections//homeworks': 'مدیریت تکالیف جلسه',
    '/teachers/': 'مشخصات استاد',

    // For students
    '/student': 'دانشجو',
    '/student/courses': 'دوره های ثبت نام شده',
    '/student/courses/': 'کلاس درس',
    '/student/courses//sections': 'جلسات دوره',
    '/student/courses//sections/': 'مشاهده جلسه',


};

function LinkRouter(props) {
    return <Link {...props} component={RouterLink}/>;
}

export default function RouterBreadCrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <LinkRouter underline="hover" color="inherit" to="/">
                خانه
            </LinkRouter>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const toNoId = to.replace(/[0-9]/g, '');


                return last ? (
                    <Typography color="text.primary" key={to}>
                        {breadcrumbNameMap[toNoId]}
                    </Typography>
                ) : (
                    <LinkRouter underline="hover" color="inherit" to={to} key={to}>
                        {breadcrumbNameMap[toNoId]}
                    </LinkRouter>
                );
            })}
        </Breadcrumbs>
    );
}