import { Dispatch, SetStateAction } from "react";
import Modal from "react-modal";
import Button from "./Button";

Modal.setAppElement("#root");

interface IRestartModal {
  restartRecordingModalShowing: boolean;
  setRestartRecordingModalShowing: Dispatch<SetStateAction<boolean>>;
  clickHandler: () => void;
}

const RestartModal = (props: IRestartModal) => {
  const {
    restartRecordingModalShowing,
    setRestartRecordingModalShowing,
    clickHandler,
  } = props;

  return (
    <Modal
      className="bg-gray-900 z-20 absolute w-[80%] h-[30%] md:w-[50%] lg:w-[40%] xl:w-[30%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl"
      isOpen={restartRecordingModalShowing}
    >
      <div className="p-8 h-full w-full flex flex-col justify-between items-center gap-4">
        <div>
          <p className="text-header mb-2">
            Are you sure you want to restart recording?
          </p>
          <p className="text-red-500 text-small font-bold italic">
            Warning: All progress will be lost!!!
          </p>
        </div>
        <div className="flex gap-4 w-full justify-around">
          <Button
            className="w-[40%] bg-gray-600 border font-bold"
            onClick={() => {
              clickHandler();
              setRestartRecordingModalShowing(false);
            }}
            type="button"
          >
            Yes
          </Button>
          <Button
            className="w-[40%] bg-gray-100 text-gray-900 border font-bold"
            onClick={() => setRestartRecordingModalShowing(false)}
            type="button"
          >
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RestartModal;
