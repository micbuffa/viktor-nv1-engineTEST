/** @typedef { import('../../sdk-parammgr').ParamMgrNode } ParamMgrNode */
/* eslint-disable no-console */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
import CompositeAudioNode from './sdks/sdk-parammgr/src/CompositeAudioNode.js';

// name is not so important here, the file Node.js is imported by the main plugin file (index.js)
export default class ViktorNV1Node extends CompositeAudioNode {
	/**
	 * @type {ParamMgrNode}
	 */
	_wamNode = undefined;


	constructor(context, dawEngine, options) {
		super(context, options);
		this.createNodes();

		this.createSynth(dawEngine);
	}

	/**
	 * @param {ParamMgrNode} wamNode
	 */
	// Mandatory.
	setup(wamNode) {
		this._wamNode = wamNode;
		this.connectNodes();
		this._wamNode.addEventListener('wam-midi', ({ detail }) => {
			console.log(detail);
			const msg = detail.data.bytes;
			console.log("setup de Node.js, msg = " + msg)
			//this.synth.send(msg);

			// May be useful
			var midimsg = this.produceMidiMessage(msg[0], msg[1], msg[2]);
			console.log("setup de Node.js, midimsg = " + midimsg)

			this.synth.externalMidiMessage(midimsg);
		});
	}

	produceMidiMessage(firstByte, secondByte, thirdByte) {
		return { data: [firstByte, secondByte, thirdByte] };
	};



	async createSynth(dawEngine) {
		this.synth = dawEngine;
	}

	/*  #########  Personnal code for the web audio graph  #########   */
	createNodes() {
		// mandatory, will create defaul input and output

		this.outputNode = this.context.createGain();
		this.dryGainNode = this.context.createGain();
		this.wetGainNode = this.context.createGain();
	}

	connectNodes() {
		this.connect(this.wetGainNode);
		this.connect(this.dryGainNode);
		this._output = this.outputNode;
		this.dryGainNode.connect(this._output);
	}

	isEnabled = true;

	set status(_sig) {
		if (this.isEnabled === _sig) return;

		this.isEnabled = _sig;
		if (_sig) {
			//console.log('BYPASS MODE OFF FX RUNNING');
			this.wetGainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.5);
			this.dryGainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5);
		} else {
			//console.log('BYPASS MODE ON');
			this.wetGainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5);
			this.dryGainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.5);
		}
	}

	// MANDATORY : redefine these methods
	// eslint-disable-next-line class-methods-use-this
	getParamValue(name) {
		return this._wamNode.getParamValue(name);
	}

	setParamValue(name, value) {
		return this._wamNode.setParamValue(name, value);
	}

	getParamsValues() {
		return this._wamNode.getParamsValues();
	}

	setParamsValues(values) {
		return this._wamNode.setParamsValues(values);
	}

	getState() {
		const selectElement = this.gui.root.querySelector('#viktorPresetMenu select');
		const currentPresetName = selectElement ? selectElement.value : null;

		const instrument = this.synth.instruments[0];

		return {
			instrumentSettings: {
				oscillatorSettings: instrument.oscillatorSettings,
				envelopesSettings: instrument.envelopesSettings,
				filterSettings: instrument.filterSettings,
				lfoSettings: instrument.lfoSettings,
				mixerSettings: instrument.mixerSettings,
				modulationSettings: instrument.modulationSettings,
				noiseSettings: instrument.noiseSettings,
				polyphonySettings: instrument.polyphonySettings
			},
			dawEngineSettings: {
				pitchSettings: this.synth.pitchSettings,
				modulationSettings: this.synth.modulationSettings,
				compressorSettings: this.synth.compressorSettings,
				delaySettings: this.synth.delaySettings,
				reverbSettings: this.synth.reverbSettings,
				masterVolumeSettings: this.synth.masterVolumeSettings
			},
			currentPresetName
		};
	}

	setState(state) {
		const selectElement = this.gui.root.querySelector('#viktorPresetMenu select');
		if (selectElement) selectElement.value = state.currentPresetName;

		const selectedItem = this.gui.plugin.patchLibrary.getPatch(state.currentPresetName);
		if (selectedItem) this.synth.loadPatch(selectedItem.patch);

		const instrument = this.synth.instruments[0];
		const settings = state.instrumentSettings || {};

		instrument.oscillatorSettings = settings.oscillatorSettings;
		instrument.envelopesSettings = settings.envelopesSettings;
		instrument.filterSettings = settings.filterSettings;
		instrument.lfoSettings = settings.lfoSettings;
		instrument.mixerSettings = settings.mixerSettings;
		instrument.modulationSettings = settings.modulationSettings;
		instrument.noiseSettings = settings.noiseSettings;
		instrument.polyphonySettings = settings.polyphonySettings;

		const dawSettings = state.dawEngineSettings || {};

		this.synth.pitchSettings = dawSettings.pitchSettings;
		this.synth.modulationSettings = dawSettings.modulationSettings;
		this.synth.compressorSettings = dawSettings.compressorSettings;
		this.synth.delaySettings = dawSettings.delaySettings;
		this.synth.reverbSettings = dawSettings.reverbSettings;
		this.synth.masterVolumeSettings = dawSettings.masterVolumeSettings;

		this.updateSynthUI();
	}

	updateSynthUI() {
		setTimeout(() => { this.gui.forceUpdateUIFromSynthState(); }, 150);
	}
}
