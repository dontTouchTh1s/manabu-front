import {Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

function CenteredBox({height = '400px'}) {
    return (
        <Grid xs={12} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: height
        }}>
            <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                {'موردی یافت نشد!'}
            </Typography>
        </Grid>
    );
}

export default CenteredBox;