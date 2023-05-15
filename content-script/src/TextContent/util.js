const loadingMessages = ["Syncing flux capacitors",  "Initializing warp drive",  "Regenerating shields",  "Reconfiguring deflector array",  "Calibrating positronic matrix",  "Synthesizing dilithium crystals",  "Modulating phaser frequencies",  "Preparing transporter beam",  "Activating cloaking device",  "Engaging hyperdrive",  "Aligning magnetic coils",  "Activating hyperdrive",  "Initializing quantum entanglement",  "Synchronizing atomic clocks",  "Coalescing dark matter",  "Converging quantum flux",  "Aligning positron beams",  "Compiling neural networks",  "Analyzing waveform data",  "Synthesizing antimatter",  "Powering up thrusters",  "Charging laser cannons",  "Calculating jump to hyperspace",  "Reassembling particles"];

const getLoadingText= () => {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[randomIndex];
}

export { getLoadingText }