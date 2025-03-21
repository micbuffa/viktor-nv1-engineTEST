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
		console.log(this);
		return {
			pitchSettings: this.synth.pitchSettings,
			modulationSettings: this.synth.modulationSettings,
			compressorSettings: this.synth.compressorSettings,
			delaySettings: this.synth.delaySettings,
			reverbSettings: this.synth.reverbSettings,
			masterVolumeSettings: this.synth.masterVolumeSettings
		};
	}

	setState(state) {
		this.synth.pitchSettings = state.pitchSettings;
		this.synth.modulationSettings = state.modulationSettings;
		this.synth.compressorSettings = state.compressorSettings;
		this.synth.delaySettings = state.delaySettings;
		this.synth.reverbSettings = state.reverbSettings;
		this.synth.masterVolumeSettings = state.masterVolumeSettings;
		this.gui.updateUIFromPatchValue();
	}
	
}
