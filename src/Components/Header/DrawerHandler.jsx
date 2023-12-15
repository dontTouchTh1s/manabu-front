import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import {useState} from "react";
import MiniDrawer from "../Drawer/Drawer";

function DrawerHandler({user}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <>
            {
                user &&
                <>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        color={'onPrimary'}
                        sx={{mr: 2}}
                        onClick={() => setDrawerOpen(!drawerOpen)}
                    >
                        <MenuIcon/>
                    </IconButton>

                    <MiniDrawer
                        isOpen={drawerOpen}
                        onChange={(v) => setDrawerOpen(v)}
                        isTeacher={user.teacher}></MiniDrawer>
                </>
            }
        </>
    );
}

export default DrawerHandler;