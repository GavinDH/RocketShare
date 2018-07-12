import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import "./appBar.css";
import { globals} from '../global';

export default function ButtonAppBar() {
    return (
        <div className="root">
            <AppBar position="static" className="AppBar-Container-color">
                <Toolbar>
                    <IconButton className="menuButton" color="inherit" aria-label="Menu" onClick={() => window.location = "/rocket/"}>
                        <i className="fa fa-rocket" />
                    </IconButton>
                    <Typography variant="title" color="inherit" className="flex fix-text-alignment-appBar">
                        {globals.webSiteName}
                    </Typography>
                    <Button color="inherit">Gavin den Hollander</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}
