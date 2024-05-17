import Card from "./Card";

const data = [
  {
    title: "Simple Sound Recorder",
    details:
      "Our Sound Recorder is a user-friendly and convenient online tool that can be accessed directly in your web browser. It enables you to capture audio using your microphone and save it as an MP3 file.",
  },
  {
    title: "Privacy Assured",
    details:
      "We ensure that our application is secure. All recordings are private to you alone: nothing is transmitted or stored on external servers.",
  },
  {
    title: "High-Quality Recording",
    details:
      "Experience crystal-clear audio recording with our Sound Recorder, ensuring professional-grade quality for your recordings.",
  },
  {
    title: "No Cost Usage",
    details:
      "Sound Recorder comes with no charges. There are no hidden fees, activation costs, or additional charges for enhanced functionalities.",
  },
];

const Details = () => {
  return (
    <div className="container p-4 md:p-8 lg:p-10 xl:p-12">
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((d, i) => (
          <Card key={i} title={d.title} details={d.details} />
        ))}
      </div>
    </div>
  );
};

export default Details;
