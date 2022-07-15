import CloseIc from "../icons/Close";
import ErrorIc from "../icons/Error";
import SuccessIc from "../icons/Success";
import Button from "./Button";

function ModalUi(props) {
  if (props.content.type === "alert" && props.content.show) {
    return (
      <div className="modalMain">
        <div className="modalContainer">
          <div className="modalBox">
            {props.content.status === "Error" ? (
              <div className="ErrorMsg alertBody">
                <div className="alertIcon">
                  <ErrorIc />
                </div>
                <div className="alertMessage">{props.content.message}</div>
                <div className="alertAction">
                  <Button
                    classes="button light rounded"
                    onClick={props.closeModelFn}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <></>
            )}
            {props.content.status === "Pending" ? (
              <div className="PendingMsg alertBody">
                <div className="alertIcon">
                  <ErrorIc />
                </div>
                <div className="alertMessage">{props.content.message}</div>
                <div className="alertAction">
                  <Button
                    classes="button light rounded"
                    onClick={props.closeModelFn}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <></>
            )}
            {props.content.status === "Success" ? (
              <div className="SuccessMsg alertBody">
                <div className="alertIcon">
                  <SuccessIc />
                </div>
                <div className="alertMessage">{props.content.message}</div>
                <div className="alertAction">
                  <Button
                    classes="button green rounded"
                    onClick={props.closeModelFn}
                  >
                    See Details
                  </Button>
                  <Button
                    classes="button dark rounded"
                    onClick={props.closeModelFn}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }

  return props.content.show ? (
    <div className="modalMain">
      <div className="modalContainer">
        <div className="modalBox">
          <div className="modalHeader">
            <h5>title</h5>
            <Button classes="linkButton">x</Button>
          </div>
          <div className="modalBody">modal content</div>
          <div className="modalFooter">
            <Button classes="button default rounded">Action</Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ModalUi;
