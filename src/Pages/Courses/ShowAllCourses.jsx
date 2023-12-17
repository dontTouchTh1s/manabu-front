import {useContext, useState} from "react";
import Api from "../../Api/Api";
import CourseCard from "./CourseCard";
import {
    Autocomplete,
    Box, Checkbox,
    Container, Fab,
    FormControl, IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import useSWR from "swr";
import useCategories from "../../Hooks/useCategories";
import LoadingCircle from "../../Components/LoadingCircle";
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import userContext from "../../Contexts/UserContext";

async function searcher([url, params]) {
    return Api.post(url, params).then(response => response.data.courses.courses);
}

function Courses() {
    const [searchCourseTitle, setSearchCourseTitle] = useState('');
    const [searchCourseLevel, setSearchCourseLevel] = useState('');
    const [searchCourseCategories, setSearchCourseCategories] = useState([]);
    const [inputSearchCourseCategories, setInputSearchCourseCategories] = useState('');
    const {categories, categoriesIsLoading} = useCategories();

    const [data, setData] = useState({
        query: searchCourseTitle,
        categoryIds: searchCourseCategories,
        take: 10
    });
    const {
        data: courses,
        isLoading: courseIsLoading
    } = useSWR(['/search/course', data], (url, params) => searcher(url, params))

    function handleSearch() {
        setData({
            query: searchCourseTitle,
            categoryIds: searchCourseCategories.map(scc => scc.id),
            take: 10
        })
    }

    const user = useContext(userContext);
    const navigate = useNavigate();

    return (
        <>
            <Box>
                <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                    دوره ها
                </Typography>
                <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                    <Grid container spacing={{xs: 2, md: 3}}>
                        <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                            <Grid xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={'جست و جو'}
                                    value={searchCourseTitle}
                                    onChange={(e) => setSearchCourseTitle(e.target.value)}
                                >

                                </TextField>
                            </Grid>
                            <Grid xs={12} sm={6} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id={'level-label'}>سطح دوره</InputLabel>
                                    <Select
                                        autoWidth
                                        labelId={'level-label'}
                                        value={searchCourseLevel}
                                        onChange={(e) => setSearchCourseLevel(e.target.value)}
                                        label={'سطح دوره'}
                                    >
                                        <MenuItem value={''} selected>همه سطوح</MenuItem>
                                        <MenuItem value={'A1'}>Elementary</MenuItem>
                                        <MenuItem value={'A2'}>Pre-Intermediate</MenuItem>
                                        <MenuItem value={'B1'}>Intermediate</MenuItem>
                                        <MenuItem value={'B2'}>Upper-Intermediate</MenuItem>
                                        <MenuItem value={'C1'}>Advanced</MenuItem>
                                        <MenuItem value={'C2'}>Proficiency</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <Autocomplete
                                    multiple
                                    fullWidth
                                    value={searchCourseCategories}
                                    onChange={(event, newValue) => {
                                        setSearchCourseCategories(newValue);
                                    }}
                                    inputValue={inputSearchCourseCategories}
                                    onInputChange={(event, newInputValue) => {
                                        setInputSearchCourseCategories(newInputValue);
                                    }}
                                    getOptionLabel={(option) => option.faName}
                                    renderOption={(props, option, {selected}) => (
                                        <li {...props}>
                                            <Checkbox
                                                style={{marginRight: 8}}
                                                checked={selected}
                                            />
                                            {option.faName}
                                        </li>
                                    )}
                                    label={'دسته بندی'}
                                    required
                                    options={categoriesIsLoading ? [] : categories}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="دسته بندی"
                                            placeholder="دسته بندی"
                                        />
                                    )}>
                                </Autocomplete>

                                {/*<TextField*/}
                                {/*    fullWidth*/}
                                {/*    select*/}
                                {/*    value={searchCourseCategories}*/}
                                {/*    onChange={(e) => setSearchCourseCategories(e.target.value)}*/}
                                {/*    label={'دسته بندی'}*/}
                                {/*    SelectProps={{*/}
                                {/*        multiple: true,*/}
                                {/*    }}*/}
                                {/*    InputProps={{*/}
                                {/*        endAdornment:*/}
                                {/*            searchCourseCategories.length === 0 ? '' :*/}
                                {/*                <InputAdornment position="end">*/}
                                {/*                    <IconButton*/}
                                {/*                        sx={{right: 12}}*/}
                                {/*                        aria-label="unselect all"*/}
                                {/*                        onClick={() => setSearchCourseCategories([])}*/}
                                {/*                        onMouseDown={() => setSearchCourseCategories([])}*/}
                                {/*                    >*/}
                                {/*                        <ClearIcon/>*/}
                                {/*                    </IconButton>*/}
                                {/*                </InputAdornment>*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    {*/}
                                {/*        !categoriesIsLoading ?*/}
                                {/*            categories.map(ctg =>*/}
                                {/*                <MenuItem key={ctg.id} value={ctg.id}>{ctg.faName}</MenuItem>*/}
                                {/*            ) : <LoadingCircle/>*/}
                                {/*    }*/}
                                {/*</TextField>*/}
                            </Grid>


                            <Grid xs={12} sm={6} md={3} sx={{
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <LoadingButton
                                    variant={'outlined'}
                                    fullWidth
                                    loading={courseIsLoading}
                                    onClick={handleSearch}
                                >
                                    {'جست و جو'}
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        {
                            !courseIsLoading ?
                                courses.length !== 0 ?
                                    courses.map(course =>
                                        <Grid key={course.id} xs={12} sm={6} md={4}>
                                            <CourseCard course={course}>
                                            </CourseCard>
                                        </Grid>
                                    ) :
                                    <Grid xs={12} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '400px'
                                    }}>
                                        <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                                            {'موردی یافت نشد!'}
                                        </Typography>
                                    </Grid>
                                : <LoadingCircle height={'100%'}/>
                        }

                    </Grid>
                    {
                        user.current.appBarUser.teacher &&
                        <Fab color="primary" variant={'extended'} aria-label="افزودن"
                             onClick={() => {
                                 navigate('/teachers/courses/create')
                             }}
                             sx={{position: 'fixed', bottom: 75}}
                        >
                            <AddIcon/>
                            ایجاد دوره
                        </Fab>
                    }
                </Container>
            </Box>

        </>
    );
}


export default Courses;