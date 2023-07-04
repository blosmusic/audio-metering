// Audio Context
Tone.context.lookAhead = 0;
Tone.context.updateInterval = 0.01;
Tone.context.bufferSize = 128;

// Audio Source
const audioSource = new Tone.UserMedia();
const meter = new Tone.Meter();
const monoSignal = new Tone.Mono();
const destination = Tone.Destination;

function updateMeter() {
  const level = meter.getValue();
  const meterElement = document.getElementById("meter");

  // Adjust meter height based on the audioSource level
  const meterHeight = level * 100 + "%";
  meterElement.style.height = meterHeight;

  // Change meter color based on signal strength
  if (level > 0.5) {
    meterElement.style.backgroundColor = "red";
  } else if (level > 0.2) {
    meterElement.style.backgroundColor = "yellow";
  } else {
    meterElement.style.backgroundColor = "green";
  }

  // Call the function again on the next animation frame
  requestAnimationFrame(updateMeter);
}


async function main() {
  // Start the audio context
  await Tone.start();
  
  audioSource.open().then(() => {
    console.log("Audio source opened");
    audioSource.connect(monoSignal);
    monoSignal.connect(meter);
    meter.connect(destination);
    // Start the meter update loop
    updateMeter();
  });
}

main();