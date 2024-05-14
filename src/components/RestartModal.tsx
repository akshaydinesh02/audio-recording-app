import { Dispatch, SetStateAction } from "react";
import Modal from "react-modal";

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
      className="bg-gray-900 z-20 absolute w-[50%] h-[20%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl"
      isOpen={restartRecordingModalShowing}
    >
      <div className="py-8 h-full w-full flex flex-col justify-between items-center gap-4">
        <div>
          <p className="text-header">
            Are you sure you want to restart recording?
          </p>
          <p className="text-red-500 text-body font-bold italic">
            Warning: All progress will be lost!!!
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              clickHandler();
              setRestartRecordingModalShowing(false);
            }}
          >
            Yes
          </button>
          <button onClick={() => setRestartRecordingModalShowing(false)}>
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RestartModal;
