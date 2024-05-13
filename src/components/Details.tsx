import Card from "./Card";

const data = [
  {
    title: "Effortless Sound Recorder",
    details:
      "Our Sound Recorder is a user-friendly and convenient online tool that can be accessed directly in your web browser. It enables you to capture audio using your microphone and save it as an MP3 file.",
  },
  {
    title: "No Cost Usage",
    details:
      "Sound Recorder comes with no charges. There are no hidden fees, activation costs, or additional charges for enhanced functionalities.",
  },
  {
    title: "Microphone Adjustment",
    details:
      "You have the ability to modify microphone settings using standard tools available in most web browsers (reducing echo and adjusting volume).",
  },
  {
    title: "Privacy Assured",
    details:
      "We ensure that our application is secure. All recordings are private to you alone: nothing is transmitted or stored on external servers.",
  },
  {
    title: "Trim Your Audio",
    details:
      "Once your recording is complete, you can trim it to include only the necessary sections.",
  },
  {
    title: "Automatic Silence Removal",
    details:
      "Our Voice Recorder automatically detects and removes silent sections at the start and end of your recording for your convenience.",
  },
];

const Details = () => {
  return (
    <div className="container px-4">
      <h1 className="p-4 text-gray-300 text-center">About</h1>
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((d, i) => (
          <Card key={i} title={d.title} details={d.details} />
        ))}
      </div>
    </div>
  );
};

export default Details;
