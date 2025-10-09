const player = document.querySelector('#player');
const mount = document.querySelector('#mount');

// Safari...
const AudioContext = window.AudioContext // Default
	|| window.webkitAudioContext // Safari and old versions of Chrome
	|| false;

const audioContext = new AudioContext();

// Pour résumer le contexte audio dès qu'on clique quelque part (par ex sur le clavier midi)
window.onclick = () => {
	console.log("click")
	audioContext.resume();
}

// Very simple function to append the plugin root dom node to the host
const mountPlugin = (domNode) => {
	mount.appendChild(domNode);
};

(async () => {
	// Init WamEnv
	const { default: initializeWamHost } = await import("./viktorNV1/sdks/sdk/src/initializeWamHost.js");
	const [hostGroupId] = await initializeWamHost(audioContext);

	// Import Viktor NV1 WAM
	let viktorInstance = await loadWam('./viktorNV1/index.js');
	window.viktorInstance = viktorInstance;

	// display Viktor NV1 WAM GUI
	const viktorPluginDomNode = await viktorInstance.createGui();
	mountPlugin(viktorPluginDomNode);

	// Load simple MIDI keyboard WAM
	let keyboardInstance = await loadWam('./simpleMidiKeyboard/index.js');

	// display keyboard GUI
	const keyboardPluginDomNode = await keyboardInstance.createGui();
	mountPlugin(keyboardPluginDomNode);

	// build audio graph
	viktorInstance.audioNode.connect(audioContext.destination);
	// connect keyboard to the synth so that synth listens to MIDI events
    keyboardInstance.audioNode.connectEvents(viktorInstance.instanceId);

	document.querySelector("#btnParameters").addEventListener("click", async () => {
		const params = await viktorInstance.audioNode.getParameterInfo();
		console.log("tetst:",params);
		console.log("Changing modulation waveform to : " + 5);
		await viktorInstance.audioNode.setParameterValues( {
			modulationWaveform:{
				id: "modulationWaveform",
				value: 5
			}
		});
	})

	async function loadWam(wamUri) {
		const { default: WAM } = await import(wamUri);

		// Create a new instance of the plugin
		// You can can optionnally give more options such as the initial state of the plugin
		const pluginInstance = await WAM.createInstance(hostGroupId, audioContext);
		return pluginInstance;
	}

	document.querySelector("#btn-save").onclick = () => {
        const pluginInstance = viktorInstance.audioNode.getState();
        sessionStorage.setItem('viktorState', JSON.stringify(pluginInstance));
    };

	document.querySelector("#btn-load").onclick = () => {
		const savedState = JSON.parse(sessionStorage.getItem('viktorState'));
		if (savedState) {
			viktorInstance.audioNode.setState(savedState);
		}
	};

})();
