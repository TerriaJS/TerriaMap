import React, { useMemo } from "react";
import { Dialog as MuiDialog } from "@mui/material";
import { useLayout } from "../layout";
import { AdcircForm, MetGetForm } from "./forms";

export const SelectionDialog = ({ viewState }) => {
  const { activeDialog, dialogIsOpen, closeDialog } = useLayout();

  const DIALOGS = {
    adcirc: <AdcircForm viewState={viewState} />,
    hurricane: <MetGetForm viewState={viewState} />
  };

  const DialogContents = useMemo(() => {
    if (!activeDialog) {
      return <div>An error occurred.</div>;
    }
    return DIALOGS[activeDialog];
  }, [activeDialog]);

  return (
    <MuiDialog
      open={dialogIsOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          minHeight: "400px",
          ".MuiDialogContent-root": {
            // because we're scrolling the results instead,
            // we don't want scrolling in the dialog content container.
            overflowY: "hidden"
          }
        }
      }}
    >
      {DialogContents}
    </MuiDialog>
  );
};
