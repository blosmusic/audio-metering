// Audio Context
Tone.context.lookAhead = 0;
Tone.context.updateInterval = 0.01;
Tone.context.bufferSize = 128;

// Audio Source
const audioSource = new Tone.UserMedia();
const meter = new Tone.Meter();
const monoSignal = new Tone.Mono();
const destination = Tone.getDestination();

function updateMeter() {
  const level = meter.getValue(); // Get the decibel level
  const meterElement = document.getElementById("meter");
  const dBElement = document.getElementById("db-value");

  // Convert decibel level to linear range between 0 and 1
  const minDecibels = -100; // Minimum decibel value (adjust as needed)
  const maxDecibels = 0; // Maximum decibel value (adjust as needed)
  const minNormalized = 0; // Minimum normalized value
  const maxNormalized = 1; // Maximum normalized value
  const normalizedValue = (level - minDecibels) / (maxDecibels - minDecibels);
  const clampedValue = Math.min(
    Math.max(normalizedValue, minNormalized),
    maxNormalized
  );


  // Adjust meter height based on the normalized value
  const meterHeight = clampedValue * 100 + "%";
  meterElement.style.height = meterHeight;

  // Change meter color based on signal strength
  if (clampedValue > 0.9) {
    meterElement.style.backgroundColor = "red";
  } else if (clampedValue > 0.8) {
    meterElement.style.backgroundColor = "yellow";
  } else {
    meterElement.style.backgroundColor = "green";
  }

  // Update dB level display
  const dBValue = Math.round(level * 10) / 10; // Round to one decimal place
  dBElement.textContent = dBValue + " dB";

  // Call the function again on the next animation frame
  requestAnimationFrame(updateMeter);
}



async function main() {
  // Start the audio context
  await Tone.start();

  try {
    await audioSource.open();
    console.log("Audio source opened");

    // Connect the audio source to the meter
    audioSource.connect(monoSignal);
    monoSignal.connect(meter);
    meter.connect(destination);

    // Start the meter update loop
    updateMeter();
  } catch (error) {
    console.error("Failed to open audio source:", error);
  }
}

main();
