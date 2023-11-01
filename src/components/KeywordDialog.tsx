import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from "@mui/material";

interface IKeywordDialog {
    isKeywordDialogOpen: boolean,
    keyword: string,
    handleCloseKeywordDialog: any
}

export const KeywordDialog = (props: IKeywordDialog) => {

    return (
        <Dialog
            fullScreen
            open={props.isKeywordDialogOpen}
        >
            <DialogTitle>คีย์เวิร์ด</DialogTitle>
            <DialogContent
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <DialogContentText>
                    <Typography
                        variant="h2"
                        component="span"
                        className="vertical-text"
                    >
                        {props.keyword}
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className="close-button" onClick={props.handleCloseKeywordDialog}>
                    <img style={{ height: 50 }} src="/close-button.png" alt="close-button" />
                </button>
            </DialogActions>
        </Dialog>
    );
}