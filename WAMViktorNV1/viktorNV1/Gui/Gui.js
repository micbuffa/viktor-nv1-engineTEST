// https://github.com/g200kg/webaudio-controls/blob/master/webaudio-controls.js
import '../utils/webaudio-controls.js';
import { transposeParam, transposeValue, getRangeCenter } from '../viktor_engine/settingsConvertor.js'

// This works when youuse a bundler such as rollup
// If you do no wan to use a bundler, then  look at other examples
// that build in pure JS the syles and html template directly
// in the code...
let style = `
  #dawContainer {
	position: relative;
    width: 1200px;
    height: 400px;
    padding-bottom: 195px;
    border-radius: 14px;
    background-position: 50% 50%;
    background-repeat: none;
    background-size: contain;
    box-shadow: 0 10px 28px rgba(0,0,0,0.8);
    color: #eee;
    transform: scale(0.9);
	user-select:none;
  }
  #viktorPresetMenu {
	position:absolute;
	left:500px;
	top:10px;
  }

  #viktorPresetMenu select {
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 30px;
	color: #eee;
	border-radius:10px;
	background: linear-gradient(to bottom, rgba(150, 150, 150, 0.69) 5%, rgba(230, 230, 230, 0) 100%);
  }
  #viktorPresetMenu select {
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 30px;
	color: #eee;
	background: linear-gradient(to bottom, rgba(150, 150, 150, 0.69) 5%, rgba(230, 230, 230, 0) 100%);
  }

  .knob-with-label {
	display:flex;
	flex-direction:column;
	text-align:center;
  }
  .slider-with-label {
	display:flex;
	flex-direction:column;
	text-align:center;
  }
  .knob-with-label h6 {
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 12px;
	color:#eee;
	margin:5px;
  }
  .knob-with-label h5 {
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 14px;
	color:#eee;
	margin:5px;
  }
  .row {
	display:flex;
	flex-direction:row;
  }
  .column {
	display:flex;
	flex-direction:column;
  }
  .no-select {
	user-select: none;
  }

  /* ---- top row, left to right ---- */
  .modulation-polyphony {
	position:absolute;
	top:60px;
	left:72px;
	display:flex;
	flex-direction:column;
	align-items:center;
	
  }
  
  .modulation-polyphony h5 {
	margin:0px;
	margin-bottom:0px;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 14px;
	color:#eee;
  }
  .modulation-polyphony-column {
	display:flex;
	flex-direction:column;
	align-items:center;
  }
  .modulation-polyphony-column h4 {
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 18px;
	color:#eee;
	margin:5px 10px 5px 10px;
  }

  .modulation-polyphony-top-column {
	border:1px solid #8e8e8e;
	border-radius: 10px 10px 0 0;
	padding-top:6px;
	
  }

  .modulation-polyphony-bottom-column {
	border:1px solid #8e8e8e;
	border-radius:  0 0 10px 10px;
	padding-top:0px;
	height:140px;
  }

  .modulation-polyphony-bottom-column h4 {
	padding: 8 0 0 5
  }

  
  .oscillators {
	position:absolute;
	top:60px;
	left:185px;
	height:332px;
	border:1px solid #8e8e8e;
	border-radius:10px;
	display:flex;
	flex-direction:column;
	align-items:center;
  }
  .oscillator-column {
		display:flex;
		flex-direction:column;
		align-items:center;
  }
	.oscillator-column h5 {
		margin-top:8px;
		margin-bottom:0px;
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 14px;
		color:#eee;
	}
	.oscillator-row-1, .oscillator-row-2,.oscillator-row-3 {
		display:flex;
		flex-direction:row;
		align-items: flex-end;
		padding:0 7 0 7;
	}

	#oscillator2h5 {
		margin-top:0px;
	}
	#oscillator3h5 {
		margin-top:15px;
		margin-bottom:10px;
	}
	.oscillator-filler {
		width:70px;
	}
	.oscillator-row-3 h5 {
		margin:0px;
	}
	.oscillators h4 {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 18px;
		color:#eee;
		margin:12px 5px 5px 5px;
	}
	.mixer {
		position:absolute;
		top:60px;
		left:394px;
		height:332px;
		border:1px solid #8e8e8e;
		border-radius:10px;
		display:flex;
		flex-direction:column;
		align-items:center;
	  }
	.mixer-column {
		display:flex;
		flex-direction:column;
		align-items:center;
  	}
	.mixer-row-1, .mixer-row-2,.mixer-row-3 {
		display:flex;
		flex-direction:row;
		align-items: center;
		padding:0 15 0 15;
	}
	.mixer-row-1 {
		padding-top:26px;
	}
	.mixer-row-2 {
		padding-top:24px;
	}
	.mixer-row-3 {
		padding-top:22px;
	}
	.mixer-filler {
		width:70px;
	}
	.mixer-row-3 h5 {
		margin:0px;
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 14px;
		color:#eee;
	}
	.mixer-filler-2 {
		height:0px;
	}
	#mixer-on-off-switch {
		margin-top:0
	}
	#mixer-knob-label-on-off {
		margin-top:9px;
	}
	#mixer-knob-label-on-off > h5{
		padding-top:10px;
		padding-bottom:10px;

	}
	.mixer h4 {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 18px;
		color:#eee;
		margin:2px 10px 5px 10px;
	}

	.noise {
		position:absolute;
		top:60px;
		left:599px;
		height:332px;
		border:1px solid #8e8e8e;
		border-radius:10px;
		display:flex;
		flex-direction:column;
		align-items: center;
	  }
	  .noise-row-1, .noise-row-2, .noise-row-3, .noise-row-4 {
	  }
	  .noise-row-1 {
		margin-top:38px;
	  }
	  .noise-row-2 {
		margin-top:35px;
	  }
	  .noise-row-3 {
		padding:10px;
		margin-top:20px;
	  }	  
	  .noise h4 {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 18px;
		color:#eee;
		margin:25px 10px 5px 10px;
	  }

	  .envelopes {
		position:absolute;
		top:60px;
		left:714px;
		height:332px;
		width:195px;
		border:1px solid #8e8e8e;
		border-radius:10px;
		display:flex;
		flex-direction:column;
		align-items: center;
	  }
	  .envelopes h5 {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 14px;
		color:#eee;
		margin-top:15px;
		margin-bottom:22px;


	  }
	  .envelopes-row-1 {
		display:flex;
		flex-direction:row;
		margin-top:-18px;
	  }
	  .envelopes-row-2 {
		display:flex;
		flex-direction:row;
		margin-top:-18px;
	  }
	  .envelopes-row-2 h5 {
		margin-top:5px;
	  }
	  .envelopes h4 {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 18px;
		color:#eee;
		margin:-10px 15px 5px 10px;
	  }

	  .filter {
		position:absolute;
		top:60px;
		left:914px;
		height:332px;
		width:100px;
		border:1px solid #8e8e8e;
		border-radius:10px;
		display:flex;
		flex-direction:column;
		align-items: center;
	  }
	  .filter h4 {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 18px;
		color:#eee;
		margin:25px 0px 0px 0px;
	  }
	  .filter h5 {
		margin-top:3px;
	  }
	  #filter-cutoff-label {
		margin-top:10px;
	  }

	.lfo {
		position:absolute;
		top:60px;
		left:1019px;
		height:332px;
		width:100px;
		border:1px solid #8e8e8e;
		border-radius:10px;
		display:flex;
		flex-direction:column;
		align-items: center;
	}
	.lfo h4 {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 100;
		font-size: 18px;
		color:#eee;
		margin:25px 0px 0px 0px;
	}
		.lfo h5 {
		margin-top:3px;
	}
	#lfo-form-label {
	margin-top:10px;
	}

  /* ----  bottom row ----  */
  .compressor {
	position:absolute;
	top:400px;
	left:747px;
	border:1px solid #8e8e8e;
	border-radius:10px;	
  }

  .compressor-first-row {
	display:flex;
	align-items: center;
  	justify-content: left;
  }
 
  
  .compressor h4 {
	margin:0px;
	margin-left:10px;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 18px;
	color:#eee;
  }

  .master-volume {
	position:absolute;
	top:400px;
	left:1050px;
	width:98px;
	height:188px;
	border:1px solid #8e8e8e;
	border-radius:10px;	
	display:flex;
	flex-direction:column;
	align-items:center;
  }
  .master-volume h4 {
	margin:0px;
	margin-top:22px;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 18px;
	color:#eee;
  }

  .reverb {
	position:absolute;
	top:503px;
	left:977px;
	width:58px;
	height: 85px;
	padding-left:5px;
	padding-right:5px;
	border:1px solid #8e8e8e;
	border-radius:10px;	
	display:flex;
	flex-direction:column;
	align-items:center;
  }
  .reverb h4 {
	margin:0px;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 18px;
	color:#eee;
  }

  .delay {
	position:absolute;
	top:503px;
	left:747px;
	width:223px;
	height:85px;
	border:1px solid #8e8e8e;
	border-radius:10px;	
	display:flex;
	flex-direction:column;
	align-items:center;
  }
  .delay h4 {
	margin:0px;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-weight: 100;
	font-size: 18px;
	color:#eee;
  }
  
  .keyboard {
	position:absolute;
	top:415px;
	left:158px;
	transform: scale(1.1, 1.15);
  }

  .modulation-wheel {
	position:absolute;
	top:420px;
	left:75px;
  }

  .pitch-bend {
	position:absolute;
	top:420px;
	left:35px;
  }

  #form-knob {
	margin:0px;
  }
  `;
let template = `
<div id="dawContainer" class="noselect">
	<!-- ###### TOP ROW #### -->
	<div id="viktorPresetMenu"></div>

	<div class="modulation-polyphony">
		<div class="modulation-polyphony-column modulation-polyphony-top-column">
			<div class="knob-with-label">
					<h5>Form</h5>
					<webaudio-knob id="knob-modulation-waveform" src="images/range-knob.png"
						value="0" min="0" max="5" step="1" diameter="240" sprites="5" width="60" height="60">
					</webaudio-knob>
			</div>
			<div class="knob-with-label">
					<h5>Glide</h5>
					<webaudio-knob src="images/0-100-knob.png" id="knob-modulation-glide"
  						value="98" min="0" max="100" step="1"  diameter="120" sprites="44" width="60" height="60"
						<!--value="{{modulation.portamento.value}}" min="{{modulation.portamento.range[ 0 ]}}" max="{{modulation.portamento.range[ 1 ]}}" step="1" diameter="120" sprites="44" width="60" height="60"> -->
					</webaudio-knob>
			</div>
			<h4>Modulation</h4>
		</div> 
		<div class="modulation-polyphony-column modulation-polyphony-bottom-column">
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-polyphony-voices"
					value="9" min="1" max="10" step="1" diameter="120" sprites="44" width="60" height="60">
				</webaudio-knob>
				<h5>Voices</h5>
			</div>
			<h4>Polyphony</h4>
		</div>
	</div>

	<div class="oscillators">
		<div class="oscillator-column">
			<h5>Oscillator 1</h5>
			<div class="oscillator-row-1">
				<webaudio-knob src="images/6-range-knob.png" id="knob-osc1-range"
					value="2" min="1" max="6" step="1" diameter="240" sprites="5" width="60" height="60">
				</webaudio-knob>
				<div class="oscillator-filler">
				</div>
				<webaudio-knob src="images/range-knob.png" id="knob-osc1-waveform"
					value="0" min="0" max="5" step="1" diameter="240" sprites="5" width="60" height="60">
				</webaudio-knob>
			</div>
			<h5>Oscillator 2</h5>
			<div class="oscillator-row-2">
				<webaudio-knob src="images/6-range-knob.png" id="knob-osc2-range"
					value="1" min="1" max="6" step="1" diameter="240" sprites="5" width="60" height="60">
				</webaudio-knob>
				<webaudio-knob src="images/0-100-knob.png" id="knob-osc2-fine-detune"
					value="200" min="1" max="1600" step="1" diameter="120" sprites="44" width="60" height="60">
				</webaudio-knob>
				<webaudio-knob src="images/range-knob.png" id="knob-osc2-waveform"
					value="2" min="0" max="5" step="1" diameter="240" sprites="5" width="60" height="60">
				</webaudio-knob>
			</div>

			<h5>Oscillator 3</h5>
			<div class="oscillator-row-3">
				<div class="knob-with-label">
					<webaudio-knob src="images/lfo-knob.png" id="knob-osc3-range"
						value="0" min="0" max="6" step="1" diameter="240" sprites="6" width="60" height="60">
					</webaudio-knob>
					<h5>Range</h5>
				</div>
				<div class="knob-with-label">
					<webaudio-knob src="images/0-100-knob.png" id="knob-osc3-fine-detune"
						value="0" min="0" max="1600" step="1" diameter="120" sprites="44" width="60" height="60">
					</webaudio-knob>
					<h5>Detune</h5>
				</div>
				<div class="knob-with-label">
					<webaudio-knob src="images/range-knob.png" id="knob-osc3-waveform"
						value="0" min="0" max="5" step="1" diameter="240" sprites="5" width="60" height="60">
					</webaudio-knob>
					<h5>Form</h5>
				</div>
  			</div>
			<h4>Oscillator Bank</h4>
		</div>
	</div>

	<div class="mixer">
		<div class="mixer-column">
			<div class="mixer-row-1"> 
				<webaudio-switch src="images/switch.png" width="40" height="40" id="mixer-switch-1"
					value="{{mixer.volume1.enabled.value}}">
				</webaudio-switch>
				<div class="mixer-filler">
				</div>
				<webaudio-knob src="images/0-100-knob.png" id="knob-mixer-volume-1"
					value="0" min="0" max="100" step="1" diameter="120" sprites="44" width="60" height="60">
				</webaudio-knob>
  			</div>
			<div class="mixer-row-2">
			  	<webaudio-switch src="images/switch.png" width="40" height="40" id="mixer-switch-2"
					value="{{mixer.volume2.enabled.value}}">
				</webaudio-switch>
				<div class="mixer-filler">
				</div>
				<webaudio-knob src="images/0-100-knob.png" id="knob-mixer-volume-2"
					value="0" min="0" max="100" step="1" diameter="120" sprites="44" width="60" height="60">
				</webaudio-knob>
			</div>
			<div class="mixer-row-3">
				<div class="knob-with-label" id="mixer-knob-label-on-off"> 
					<webaudio-switch id="mixer-on-off-switch" src="images/switch.png" width="40" height="40" id="mixer-switch-3"
						value="{{mixer.volume3.enabled.value}}">
					</webaudio-switch>
					<div class="mixer-filler-2"></div>
					<h5 id="mixer-on-off">On/Off</h5>
				</div>
				<div class="mixer-filler">
				</div>
				<div class="knob-with-label">
					<webaudio-knob src="images/0-100-knob.png" id="knob-mixer-volume-3"
						value="0" min="0" max="100" step="1" diameter="120" sprites="44" width="60" height="60">
					</webaudio-knob>
					<h5>Volume</h5>
  				</div>
			</div>
		</div>
		<h4>Mixer</h4>
	</div>

	<div class="noise">
		<div class="noise-row-1">
			<webaudio-switch src="images/switch.png" width="40" height="40" id="noise-switch"
				value="{{noise.enabled.value}}">
			</webaudio-switch>
		</div>
		<div class="noise-row-2">
			<webaudio-knob src="images/0-100-knob.png" id="knob-noise-level"
				value="0" min="0" max="100" step="1" diameter="120" sprites="44" width="60" height="60">
			</webaudio-knob>
		</div>
		<div class="noise-row-3">
			<webaudio-slider direction="horz" value="2"
				min="0" max="2" step="1"
				src="images/noise-slider-base.png" knobsrc="images/slider-knob.png" id="knob-noise-type"
				height="45" width="90" ditchlength="40" knobwidth="20" knobheight="20">
			</webaudio-slider>
  		</div>
		<h4>Noise</h4>
	</div>

	<div class="envelopes">
		<h5>Primary</h5>
		<div class="envelopes-row-1">	
			<webaudio-slider direction="vert" id="env-primary-attack"
				value="0" 
				min="0" max="100" step="1"
				src="images/0-100-slider-base.png" knobsrc="images/slider-knob.png"
				height="90" width="45" ditchlength="80" knobwidth="20" knobheight="20">
			</webaudio-slider>
			<webaudio-slider direction="vert" id="env-primary-decay"
				value="{0" min="0" max="100" step="1"
				src="images/0-100-slider-base.png" knobsrc="images/slider-knob.png"
				height="90" width="45" ditchlength="80" knobwidth="20" knobheight="20">
			</webaudio-slider>
			<webaudio-slider direction="vert" id="env-primary-sustain"
				value="100" min="0" max="100" step="1"
				src="images/0-100-slider-base.png" knobsrc="images/slider-knob.png"
				height="90" width="45" ditchlength="80" knobwidth="20" knobheight="20">
			</webaudio-slider>
			<webaudio-slider direction="vert" id="env-primary-release"
				value="100" min="0" max="100" step="1"
				src="images/0-100-slider-base.png" knobsrc="images/slider-knob.png"
				height="90" width="45" ditchlength="80" knobwidth="20" knobheight="20">
			</webaudio-slider>
		</div>
		<h5>Filter</h5>
		<div class="envelopes-row-2">
  			<div class="slider-with-label">
				<webaudio-slider direction="vert" id="env-filter-attack"
					value="100" min="0" max="100" step="1"
					src="images/0-100-slider-base.png" knobsrc="images/slider-knob.png"
					height="90" width="45" ditchlength="80" knobwidth="20" knobheight="20">
				</webaudio-slider>
				<h5>Attack</h5>
			</div>
			<div class="slider-with-label">
				<webaudio-slider direction="vert" id="env-filter-decay"
					value="100" min="0" max="100" step="1"
					src="images/0-100-slider-base.png" knobsrc="images/slider-knob.png"
					height="90" width="45" ditchlength="80" knobwidth="20" knobheight="20">
				</webaudio-slider>
				<h5>Decay</h5>
			</div>
			<div class="slider-with-label">
				<webaudio-slider direction="vert" id="env-filter-sustain"
					value="100" min="0" max="100" step="1"
					src="images/0-100-slider-base.png" knobsrc="images/slider-knob.png"
					height="90" width="45" ditchlength="80" knobwidth="20" knobheight="20">
				</webaudio-slider>
				<h5>Sustain</h5>
			</div>
			<div class="slider-with-label">
				<webaudio-slider direction="vert" id="env-filter-release"
					value="100" min="0" max="100" step="1"
					src="images/0-100-slider-base.png" knobsrc="images/slider-knob.png"
					height="90" width="45" ditchlength="80" knobwidth="20" knobheight="20">
				</webaudio-slider>
				<h5>Release</h5>
			</div>
		</div>
		<h4>Envelopes</h4>
	</div>

	<div class="filter">
		<div class="knob-with-label">
			<h5 id="filter-cutoff-label">Cutoff</h5>
			<webaudio-knob src="images/0-100-knob.png" id="knob-filter-cutoff"
				value="55" min="0" max="500" step="1" diameter="120" sprites="44" width="60" height="60">
			</webaudio-knob>
		</div>
		<div class="knob-with-label">
			<h5>Emphasis</h5>
			<webaudio-knob src="images/0-100-knob.png" id="knob-filter-emphasis"
				value="41" min="0" max="100" step="1" diameter="120" sprites="44" width="60" height="60">
			</webaudio-knob>
		</div>
		<div class="knob-with-label">
			<h5>Simple/Env</h5>
			<webaudio-knob src="images/0-100-knob.png" id="knob-filter-env-amount"
				value="48" min="0" max="100" step="1" diameter="120" sprites="44" width="60" height="60">
			</webaudio-knob>
		</div>
		<h4>LP Filter</h4>
	</div>

	<div class="lfo">
		<div class="knob-with-label">
			<h5 id="lfo-form-label">Form</h5>
			<webaudio-knob src="images/range-knob.png" id="knob-lfo-waveform"
				value="0" min="0" max="5" step="1" diameter="240" sprites="5" width="60" height="60">
			</webaudio-knob>
		</div>
		<div class="knob-with-label">
			<h5>Rate</h5>
			<webaudio-knob src="images/0-100-knob.png"  id="knob-lfo-rate"
				value="3" min="1" max="25" step="1" diameter="120" sprites="44" width="60" height="60">
			</webaudio-knob>
		</div>
		<div class="knob-with-label">
			<h5>Clean/LFO</h5>
			<webaudio-knob src="images/0-100-knob.png" id="knob-lfo-amount"
				value="46" min="0" max="100" step="1" diameter="120" sprites="44" width="60" height="60">
			</webaudio-knob>
		</div>
		<h4>LFO</h4>
	</div>

    <!-- ###### BOTTOM ROW #### -->
	<div class="compressor">
		<div class="row compressor-first-row">
			<div class="on-off-switch no-padding"> 
					<webaudio-switch src="images/switch.png" width="20" height="20" id="compressor-switch"
						value="{{compressor.enabled.value}}"></webaudio-switch>
			</div>
			<h4>Compressor</h4>
		</div>
		<div class="row">
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-compressor-threshold"
					value="-19.5" min="-60" max="0"
					step="0.5"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Threshold</h6>
			</div>
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-compressor-ratio"
					value="3" min="1" max="20"
					step="0.1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Ratio</h6>
			</div>
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-compressor-knee"
					value="2" min="0" max="20"
					step="0.1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Knee</h6>
			</div>
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-compressor-attack"
					value="0.1" min="0.0" max="1000.0"
					step="0.1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Attack</h6>
			</div>
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-compressor-release"
					value="20" min="0" max="1000"
					step="1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Release</h6>
			</div>
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-compressor-makeupGain"
					value="0.0" min="0.0" max="10.0"
					step="0.1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Gain</h6>
			</div>
		</div>
	</div>

	<div class="master-volume">
		<h4>Volume</h4>
		<div class="row">
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="masterVolume"
					value="100" min="0" max="100" step=1 diameter="120" sprites="44" width="90" height="90"></webaudio-knob>
			<h6>Level</h6>
			</div>
		</div>
	</div>

	<div class="reverb">
		<h4>Reverb</h4>
		<div class="row">
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-reverb-level"
					value="0" min="0" max="100"
					step="1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Level</h6>
			</div>
		</div>
	</div>

	<div class="delay">
		<h4>Delay</h4>
		<div class="row">
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-delay-time"
					value="52" min="0" max="100"
					step="1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Time</h6>
			</div>
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-delay-feedback"
					value="87" min="0" max="100"
					step="1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Feed</h6>
			</div>
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-delay-dry"
					value="100" min="0" max="100"
					step="1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Dry</h6>
			</div>
			<div class="knob-with-label">
				<webaudio-knob src="images/0-100-knob.png" id="knob-delay-wet"
					value="0" min="0" max="100"
					step="1"
					sprites="44" width="45" height="45"></webaudio-knob>
				<h6>Wet</h6>
			</div>
		</div>
	</div>



	<div class="modulation-wheel">
		<webaudio-knob src="images/wheel.png" value="50" id="modulation-wheel"
			min="0" max="128"
			sprites="44" width="60" height="150">
		</webaudio-knob>
	</div>

	<div class="pitch-bend">
		<webaudio-knob src="images/wheel.png" value="50" id="pitch-bend-left"
			min="0" max="128" step="1"
			sprites="44" width="60" height="150">
		</webaudio-knob>
	</div>

	<div class="keyboard">
	<webaudio-keyboard id="piano-keyboard"
		keys="39" min="61" width="539" height="162">
	</webaudio-keyboard>
	<!-- 	<webaudio-keyboard
				keys="39" min="61" width="539" height="170">
			</webaudio-keyboard> -->
</div>
</div>


`;

const getBaseURL = () => {
	const base = new URL('.', import.meta.url);
	return `${base}`;
};

// The GUI is a WebComponent. Not mandatory but useful.
// MANDORY : the GUI should be a DOM node. WebComponents are
// practical as they encapsulate everyhing in a shadow dom
export default class ViktorNV1HTMLElement extends HTMLElement {
	// plugin = the same that is passed in the DSP part. It's the instance
	// of the class that extends WebAudioModule. It's an Observable plugin
	constructor(plugin) {
		super();

		this.root = this.attachShadow({
			mode: 'open',
		});
		this.root.innerHTML = `<style>${style}</style>${template}`;

		// MANDATORY for the GUI to observe the plugin state
		this.plugin = plugin;

		this.plugin.audioNode.gui = this;

		// Compute base URI of this main.html file. This is needed in order
		// to fix all relative paths in CSS, as they are relative to
		// the main document, not the plugin's main.html
		this.basePath = getBaseURL();
		console.log('basePath = ' + this.basePath);

		// Fix relative path in WebAudio Controls elements
		this.fixRelativeImagePaths();

		this.setBackgroundImage();
	}

	setBackgroundImage() {
		let dawContainer = this.root.querySelector("#dawContainer");
		let backgroundImagePath = this.basePath + "/images/synth-base-panel.jpg";
		console.log(backgroundImagePath)
		dawContainer.style.backgroundImage = `url(${backgroundImagePath})`;
	}


	fixRelativeImagePaths() {
		// change webaudiocontrols relative paths for spritesheets to absolute
		let webaudioControls = this.root.querySelectorAll(
			'webaudio-knob, webaudio-slider, webaudio-switch, img'
		);
		webaudioControls.forEach((e) => {
			let currentImagePath = e.getAttribute('src');
			if (currentImagePath !== undefined) {
				//console.log("Got wc src as " + e.getAttribute("src"));
				let imagePath = e.getAttribute('src');
				e.setAttribute('src', this.basePath + '/' + imagePath);
				//console.log("After fix : wc src as " + e.getAttribute("src"));
			}
		});

		let sliders = this.root.querySelectorAll('webaudio-slider');
		sliders.forEach((e) => {
			let currentImagePath = e.getAttribute('knobsrc');
			if (currentImagePath !== undefined) {
				console.log('Got img src as ' + e.getAttribute('src'));
				let imagePath = e.getAttribute('knobsrc');
				e.setAttribute('knobsrc', this.basePath + '/' + imagePath);
				console.log(
					'After fix : slider knobsrc as ' + e.getAttribute('knobsrc')
				);
			}
		});
	}


	connectedCallback() {
		// appelé une fois que la GUI est affichée
		this.setResources();
		this.setKnobs();
		this.setSwitchListener();

		console.log("connected callback");
		this.buildPresetMenu(this.plugin.patchLibrary, this.plugin.dawEngine);

		window.requestAnimationFrame(this.handleAnimationFrame);
	}

	buildPresetMenu(patchLibrary, dawEngine) {
		var select = document.createElement("select"),
			option,
			patch,
			i;

		let names = patchLibrary.getDefaultNames()
		// build select options
		for (i = 0; i < names.length; i++) {
			option = document.createElement("option");
			option.value = names[i];
			option.text = names[i];
			select.appendChild(option);
		}

		select.addEventListener("change", () => {
			var selectedItem = patchLibrary.getPatch(select.value);

			dawEngine.loadPatch(selectedItem.patch);
			this.updateUIFromPatchValue();
		});

		this.root.querySelector('#viktorPresetMenu').append(select);
	}

	updateStatus = (status) => {
		//this.shadowRoot.querySelector('#switch1').value = status;
	};

	handleAnimationFrame = () => {
		const { enabled } = this.plugin.audioNode.getParamsValues();

		window.requestAnimationFrame(this.handleAnimationFrame);
	};

	/**
	 * Change relative URLS to absolute URLs for CSS assets, webaudio controls spritesheets etc.
	 */
	setResources() {
	}

	updateUIFromPatchValue() {
		let dawEngine = this.plugin.dawEngine;
		let synth = this.getSynth();
		// set Master volume from internal settings
		//this.root.getElementById('masterVolume').value = transposeParam(dawEngine.masterVolumeSettings.level, [0, 100]);

		// ####### OSCILLATORS ######
		// OSC1 range
		let osc1rangeValue = parseInt(transposeParam(synth.oscillatorSettings.osc1.range, [1, 6]).value);
		this.root.getElementById('knob-osc1-range').setValue(osc1rangeValue, true);
		// OSC1 waveform
		let osc1WaveformValue = transposeParam(synth.oscillatorSettings.osc1.waveform, [0, 5]).value;
		this.root.getElementById('knob-osc1-waveform').setValue(osc1WaveformValue, false);

		// set oscillator 2 detune knob from internal settings
		const osc2DetuneValue = transposeParam(synth.oscillatorSettings.osc2.fineDetune, [0, 1600]).value;
		this.root.getElementById('knob-osc2-fine-detune').setValue(osc2DetuneValue, false);


		// osc2 range
		let osc2rangeValue = parseInt(transposeParam(synth.oscillatorSettings.osc2.range, [1, 6]).value);
		this.root.getElementById('knob-osc2-range').setValue(osc2rangeValue, false);
		// osc2 waveform
		let osc2WaveformValue = transposeParam(synth.oscillatorSettings.osc2.waveform, [0, 5]).value;
		this.root.getElementById('knob-osc2-waveform').setValue(osc2WaveformValue, false);

		// set oscillator 3 detune knob from internal settings
		const osc3DetuneValue = transposeParam(synth.oscillatorSettings.osc3.fineDetune, [0, 1600]).value;
		this.root.getElementById('knob-osc3-fine-detune').setValue(osc3DetuneValue, false);

		// osc3 range
		let osc3rangeValue = parseInt(transposeParam(synth.oscillatorSettings.osc3.range, [1, 6]).value);
		this.root.getElementById('knob-osc3-range').setValue(osc3rangeValue, false);

		// osc3 waveform
		let osc3WaveformValue = transposeParam(synth.oscillatorSettings.osc3.waveform, [0, 5]).value;
		this.root.getElementById('knob-osc3-waveform').setValue(osc3WaveformValue, false);

		// ####### MIXER ######
		// mixer switch 1
		this.root.getElementById('mixer-switch-1').value = synth.mixerSettings.volume1.enabled.value;
		// mixer volume 1
		this.root.getElementById('knob-mixer-volume-1').value = transposeParam(synth.mixerSettings.volume1.level, [0, 100]).value;
		// mixer switch 2
		this.root.getElementById('mixer-switch-2').value = synth.mixerSettings.volume2.enabled.value;
		// mixer volume 2
		this.root.getElementById('knob-mixer-volume-2').value = transposeParam(synth.mixerSettings.volume2.level, [0, 100]).value;
		// mixer on off switch
		this.root.getElementById('mixer-on-off-switch').value = synth.mixerSettings.volume3.enabled.value;
		// mixer volume 3
		this.root.getElementById('knob-mixer-volume-3').value = transposeParam(synth.mixerSettings.volume3.level, [0, 100]).value;

		// ####### NOISE ######
		// noise switch
		this.root.getElementById('noise-switch').value = synth.noiseSettings.enabled.value;
		// noise level
		this.root.getElementById('knob-noise-level').value = transposeParam(synth.noiseSettings.level, [0, 100]).value;
		// noise type
		this.root.getElementById('knob-noise-type').value = synth.noiseSettings.type.value;

		// ####### ENVELOPPES ######
		// primary attack
		const value = Math.abs(transposeParam(synth.settings.envelopes.primary.attack, [0, 100]).value);
		this.root.getElementById('env-primary-attack').value = value;
		// primary decay
		this.root.getElementById('env-primary-decay').value = transposeParam(synth.settings.envelopes.primary.decay, [0, 100]).value;
		// primary sustain
		this.root.getElementById('env-primary-sustain').value = transposeParam(synth.settings.envelopes.primary.sustain, [0, 100]).value;
		// primary release
		this.root.getElementById('env-primary-release').value = transposeParam(synth.settings.envelopes.primary.release, [0, 100]).value;
		// env filter attack
		this.root.getElementById('env-filter-attack').value = transposeParam(synth.settings.envelopes.filter.attack, [0, 100]).value;
		// env filter decay
		this.root.getElementById('env-filter-decay').value = transposeParam(synth.settings.envelopes.filter.decay, [0, 100]).value;
		// env filter sustain
		this.root.getElementById('env-filter-sustain').value = transposeParam(synth.settings.envelopes.filter.sustain, [0, 100]).value;
		// env filter release
		this.root.getElementById('env-filter-release').value = transposeParam(synth.settings.envelopes.filter.release, [0, 100]).value;

		// ######## LP Filter #########
		// filter cutoff
		this.root.getElementById('knob-filter-cutoff').value = transposeParam(synth.filterSettings.cutoff, [0, 500]).value;
		// filter emphasis
		this.root.getElementById('knob-filter-emphasis').value = transposeParam(synth.filterSettings.emphasis, [0, 100]).value;
		// filter env amount
		this.root.getElementById('knob-filter-env-amount').value = transposeParam(synth.filterSettings.envAmount, [0, 100]).value;

		// ######## LFO #########
		// lfo waveform
		this.root.getElementById('knob-lfo-waveform').value = transposeParam(synth.lfoSettings.waveform, [0, 5]).value;
		// lfo rate
		this.root.getElementById('knob-lfo-rate').value = transposeParam(synth.lfoSettings.rate, [1, 25]).value;
		// lfo amount
		this.root.getElementById('knob-lfo-amount').value = transposeParam(synth.lfoSettings.amount, [0, 100]).value;

		// ######## COMPRESSOR #########
		// compressor switch
		this.root.getElementById('compressor-switch').value = dawEngine.compressorSettings.enabled.value;
		// compressor threshold
		this.root.getElementById('knob-compressor-threshold').value = transposeParam(dawEngine.compressorSettings.threshold, [-60, 0]).value;
		// compressor ratio
		this.root.getElementById('knob-compressor-ratio').value = transposeParam(dawEngine.compressorSettings.ratio, [1, 20]).value;
		// compressor knee
		this.root.getElementById('knob-compressor-knee').value = transposeParam(dawEngine.compressorSettings.knee, [0, 20]).value;
		// compressor attack
		this.root.getElementById('knob-compressor-attack').value = transposeParam(dawEngine.compressorSettings.attack, [0, 1000]).value;
		// compressor release
		this.root.getElementById('knob-compressor-release').value = transposeParam(dawEngine.compressorSettings.release, [0, 1000]).value;
		// compressor makeup gain
		this.root.getElementById('knob-compressor-makeupGain').value = transposeParam(dawEngine.compressorSettings.makeupGain, [0, 10]).value;

		// ######## DELAY #########
		// delay time
		this.root.getElementById('knob-delay-time').value = transposeParam(dawEngine.delaySettings.time, [0, 100]).value;
		// delay feedback
		this.root.getElementById('knob-delay-feedback').value = transposeParam(dawEngine.delaySettings.feedback, [0, 100]).value;
		// delay dry
		this.root.getElementById('knob-delay-dry').value = transposeParam(dawEngine.delaySettings.dry, [0, 100]).value;
		// delay wet
		this.root.getElementById('knob-delay-wet').value = transposeParam(dawEngine.delaySettings.wet, [0, 100]).value;

		// ### REVERB ####
		// reverb level
		this.root.getElementById('knob-reverb-level').value = transposeParam(dawEngine.reverbSettings.level, [0, 100]).value;

		// ### MODULATION ###
		// modulation waveform
		this.root.getElementById('knob-modulation-waveform').value = transposeParam(synth.modulationSettings.waveform, [0, 5]).value;
		// modulation glide
		this.root.getElementById('knob-modulation-glide').value = transposeParam(synth.modulationSettings.portamento, [0, 100]).value;

		// ### POLYPHONY ###
		// polyphony voices
		this.root.getElementById('knob-polyphony-voices').value = synth.polyphonySettings.voiceCount.value;

		// ### MODULATION WHEEL ###
		this.root.getElementById('modulation-wheel').value = transposeParam(synth.modulationSettings.rate, [0, 128]).value;
		// ### PITCH BEND ###
		this.root.getElementById('pitch-bend-left').value = transposeParam(dawEngine.pitchSettings.bend, [0, 128]).value;
	}

	forceUpdateUIFromSynthState() {
		const dawEngine = this.plugin.dawEngine;
		const synth = this.getSynth();

		this.root.getElementById('knob-osc1-range').setValue(parseInt(transposeParam(synth.oscillatorSettings.osc1.range, [1, 6]).value), false);
		this.root.getElementById('knob-osc1-waveform').setValue(transposeParam(synth.oscillatorSettings.osc1.waveform, [0, 5]).value, false);
		this.root.getElementById('knob-osc2-range').setValue(parseInt(transposeParam(synth.oscillatorSettings.osc2.range, [1, 6]).value), false);
		this.root.getElementById('knob-osc2-waveform').setValue(transposeParam(synth.oscillatorSettings.osc2.waveform, [0, 5]).value, false);
		this.root.getElementById('knob-osc2-fine-detune').setValue(transposeParam(synth.oscillatorSettings.osc2.fineDetune, [0, 1600]).value, false);
		this.root.getElementById('knob-osc3-range').setValue(parseInt(transposeParam(synth.oscillatorSettings.osc3.range, [1, 6]).value), false);
		this.root.getElementById('knob-osc3-waveform').setValue(transposeParam(synth.oscillatorSettings.osc3.waveform, [0, 5]).value, false);
		this.root.getElementById('knob-osc3-fine-detune').setValue(transposeParam(synth.oscillatorSettings.osc3.fineDetune, [0, 1600]).value, false);

		this.root.getElementById('mixer-switch-1').value = synth.mixerSettings.volume1.enabled.value;
		this.root.getElementById('knob-mixer-volume-1').value = transposeParam(synth.mixerSettings.volume1.level, [0, 100]).value;
		this.root.getElementById('mixer-switch-2').value = synth.mixerSettings.volume2.enabled.value;
		this.root.getElementById('knob-mixer-volume-2').value = transposeParam(synth.mixerSettings.volume2.level, [0, 100]).value;
		this.root.getElementById('mixer-on-off-switch').value = synth.mixerSettings.volume3.enabled.value;
		this.root.getElementById('knob-mixer-volume-3').value = transposeParam(synth.mixerSettings.volume3.level, [0, 100]).value;

		this.root.getElementById('noise-switch').value = synth.noiseSettings.enabled.value;
		this.root.getElementById('knob-noise-level').value = transposeParam(synth.noiseSettings.level, [0, 100]).value;
		this.root.getElementById('knob-noise-type').value = synth.noiseSettings.type.value;

		this.root.getElementById('env-primary-attack').value = transposeParam(synth.envelopesSettings.primary.attack, [0, 100]).value;
		this.root.getElementById('env-primary-decay').value = transposeParam(synth.envelopesSettings.primary.decay, [0, 100]).value;
		this.root.getElementById('env-primary-sustain').value = transposeParam(synth.envelopesSettings.primary.sustain, [0, 100]).value;
		this.root.getElementById('env-primary-release').value = transposeParam(synth.envelopesSettings.primary.release, [0, 100]).value;
		this.root.getElementById('env-filter-attack').value = transposeParam(synth.envelopesSettings.filter.attack, [0, 100]).value;
		this.root.getElementById('env-filter-decay').value = transposeParam(synth.envelopesSettings.filter.decay, [0, 100]).value;
		this.root.getElementById('env-filter-sustain').value = transposeParam(synth.envelopesSettings.filter.sustain, [0, 100]).value;
		this.root.getElementById('env-filter-release').value = transposeParam(synth.envelopesSettings.filter.release, [0, 100]).value;

		this.root.getElementById('knob-filter-cutoff').value = transposeParam(synth.filterSettings.cutoff, [0, 500]).value;
		this.root.getElementById('knob-filter-emphasis').value = transposeParam(synth.filterSettings.emphasis, [0, 100]).value;
		this.root.getElementById('knob-filter-env-amount').value = transposeParam(synth.filterSettings.envAmount, [0, 100]).value;

		this.root.getElementById('knob-lfo-waveform').value = transposeParam(synth.lfoSettings.waveform, [0, 5]).value;
		this.root.getElementById('knob-lfo-rate').value = transposeParam(synth.lfoSettings.rate, [1, 25]).value;
		this.root.getElementById('knob-lfo-amount').value = transposeParam(synth.lfoSettings.amount, [0, 100]).value;

		this.root.getElementById('knob-modulation-waveform').value = transposeParam(synth.modulationSettings.waveform, [0, 5]).value;
		this.root.getElementById('knob-modulation-glide').value = transposeParam(synth.modulationSettings.portamento, [0, 100]).value;
		this.root.getElementById('modulation-wheel').value = transposeParam(synth.modulationSettings.rate, [0, 128]).value;

		this.root.getElementById('knob-polyphony-voices').value = synth.polyphonySettings.voiceCount.value;

		this.root.getElementById('compressor-switch').value = dawEngine.compressorSettings.enabled.value;
		this.root.getElementById('knob-compressor-threshold').value = transposeParam(dawEngine.compressorSettings.threshold, [-60, 0]).value;
		this.root.getElementById('knob-compressor-ratio').value = transposeParam(dawEngine.compressorSettings.ratio, [1, 20]).value;
		this.root.getElementById('knob-compressor-knee').value = transposeParam(dawEngine.compressorSettings.knee, [0, 20]).value;
		this.root.getElementById('knob-compressor-attack').value = transposeParam(dawEngine.compressorSettings.attack, [0, 1000]).value;
		this.root.getElementById('knob-compressor-release').value = transposeParam(dawEngine.compressorSettings.release, [0, 1000]).value;
		this.root.getElementById('knob-compressor-makeupGain').value = transposeParam(dawEngine.compressorSettings.makeupGain, [0, 10]).value;

		this.root.getElementById('knob-delay-time').value = transposeParam(dawEngine.delaySettings.time, [0, 100]).value;
		this.root.getElementById('knob-delay-feedback').value = transposeParam(dawEngine.delaySettings.feedback, [0, 100]).value;
		this.root.getElementById('knob-delay-dry').value = transposeParam(dawEngine.delaySettings.dry, [0, 100]).value;
		this.root.getElementById('knob-delay-wet').value = transposeParam(dawEngine.delaySettings.wet, [0, 100]).value;

		this.root.getElementById('knob-reverb-level').value = transposeParam(dawEngine.reverbSettings.level, [0, 100]).value;

		this.root.getElementById('pitch-bend-left').value = transposeParam(dawEngine.pitchSettings.bend, [0, 128]).value;

		this.root.getElementById('masterVolume').value = transposeParam(dawEngine.masterVolumeSettings.level, [0, 100]).value;

	}

	getSynth() {
		return this.plugin.dawEngine.selectedInstrument;
	}

	getDawEngine() {
		return this.plugin.dawEngine;
	}

	getModulationValuesFromUI() {
		const dawEngine = this.getDawEngine();
		const synth = this.getSynth();


		const waveform = {
			value: parseInt(this.root.getElementById('knob-modulation-waveform').value),
			range: [0, 5]
		};

		const portamento = {
			value: this.root.getElementById('knob-modulation-glide').value,
			range: [0, 100]
		}
		const portamentoInNewRange = transposeParam(portamento, [0, 0.16666666666666666]);

		const rate = synth.modulationSettings.rate;
		return {
			waveform,
			portamento: portamentoInNewRange,
			rate: transposeParam(rate, [0, 15])
		}
	}

	setModulationValues() {
		// easier to compare to orinal viktor UI code
		const synth = this.getSynth();
		// get all knob values as an object
		let uiSettings = this.getModulationValuesFromUI();

		// The daw engine (synth) is designed so that we always need to set its property object "modulationSettings" as
		// a whole, not just set a single property
		synth.modulationSettings = {
			waveform: uiSettings.waveform,
			portamento: uiSettings.portamento,
			// rate is changed using the modulation wheel.
			rate: uiSettings.rate
		};
	}

	/* getPolyphonyValuesFromUI() {
		const synth = this.getSynth();
		const voices = {
			value: parseInt(this.root.getElementById('knob-polyphony-voices').value),
			range: [1, 10]
		}
		let voicesAdjusted = transposeParam(voices, [1, 10]);

		const substain = {
			value: parseInt(this.root.getElementById('knob-polyphony-sustain').value),
			range: [0, 100]
		}

		return {
			voices: voicesAdjusted,
			substain: transposeParam(substain, [0, 1])
		}
	}

	setPolyphonyValues() {
		const synth = this.getSynth();
		let uiSettings = this.getPolyphonyValuesFromUI();

		synth.polyphonySettings = {
			voices: uiSettings.voices,
			substain: uiSettings.substain
		};

		console.log("Polyphony settings");
		console.dir(synth.polyphonySettings);
	} */


	getOscillatorValuesFromUI() {
		const synth = this.getSynth();
		// OSC1
		// osc1 range
		const osc1Range = {
			value: parseInt(this.root.getElementById('knob-osc1-range').value),
			range: [1, 6]
		}
		let osc1RangeAdjusted = transposeParam(osc1Range, [-4, 2]);

		// osc1 waveform
		const osc1Waveform = {
			value: parseInt(this.root.getElementById('knob-osc1-waveform').value),
			range: [0, 5]
		}

		// OSC2
		// osc2 range
		const osc2Range = {
			value: parseInt(this.root.getElementById('knob-osc2-range').value),
			range: [1, 6]
		}
		let osc2RangeAdjusted = transposeParam(osc2Range, [-4, 2]);

		// osc2 waveform
		const osc2Waveform = {
			value: parseInt(this.root.getElementById('knob-osc2-waveform').value),
			range: [0, 5]
		}
		// osc2 fine detune
		const osc2FineDetune = {
			value: parseInt(this.root.getElementById('knob-osc2-fine-detune').value),
			range: [1, 1600]
		}
		let osc2FineDetuneRangeAdjusted = transposeParam(osc2FineDetune, [-800, 800]);

		// OSC3
		// osc3 range
		const osc3Range = {
			value: parseInt(this.root.getElementById('knob-osc3-range').value),
			range: [0, 6]
		}
		let osc3RangeAdjusted = transposeParam(osc3Range, [-4, 2]);

		const osc3FineDetune = {
			value: parseInt(this.root.getElementById('knob-osc3-fine-detune').value),
			range: [1, 1600]
		}
		let osc3FineDetuneRangeAdjusted = transposeParam(osc3FineDetune, [-800, 800]);
		// osc2 waveform
		const osc3Waveform = {
			value: parseInt(this.root.getElementById('knob-osc3-waveform').value),
			range: [0, 5]
		}

		return {
			osc1: {
				value: osc1RangeAdjusted,
				waveform: osc1Waveform
			},
			osc2: {
				value: osc2RangeAdjusted,
				fineDetune: osc2FineDetuneRangeAdjusted,
				waveform: osc2Waveform
			},
			osc3: {
				value: osc3RangeAdjusted,
				fineDetune: osc3FineDetuneRangeAdjusted,
				waveform: osc3Waveform
			}
		}
	}

	setOscillatorValues() {
		let synth = this.getSynth();
		// get all knob values as an object
		let uiSettings = this.getOscillatorValuesFromUI();

		synth.oscillatorSettings = {
			osc1: {
				range: uiSettings.osc1.value,
				fineDetune: synth.oscillatorSettings.osc1.fineDetune,
				waveform: uiSettings.osc1.waveform
			},
			osc2: {
				range: uiSettings.osc2.value,
				fineDetune: uiSettings.osc2.fineDetune,
				waveform: uiSettings.osc2.waveform
			},
			osc3: {
				range: uiSettings.osc3.value,
				fineDetune: uiSettings.osc3.fineDetune,
				waveform: uiSettings.osc3.waveform
			}
		};

	}

	getMixerValuesFromUI() {
		const synth = this.getSynth();
		const mixer = synth.mixerSettings;

		const volume1 = {
			enabled: {
				value: mixer.volume1.enabled,
				range: [0, 1]
			},
			level: {
				value: parseInt(this.root.getElementById('knob-mixer-volume-1').value),
				range: [0, 100]
			}
		};
		const volume2 = {
			enabled: {
				value: mixer.volume2.enabled,
				range: [0, 1]
			},
			level: {
				value: parseInt(this.root.getElementById('knob-mixer-volume-2').value),
				range: [0, 100]
			}
		};
		const volume3 = {
			enabled: {
				value: mixer.volume3.enabled,
				range: [0, 1]
			},
			level: {
				value: parseInt(this.root.getElementById('knob-mixer-volume-3').value),
				range: [0, 100]
			}
		};

		volume1.value = transposeParam(volume1.level, [0, 1]);
		volume2.value = transposeParam(volume2.level, [0, 1]);
		volume3.value = transposeParam(volume3.level, [0, 1]);

		return {
			volume1,
			volume2,
			volume3
		}
	}

	setMixerValues() {
		let synth = this.getSynth();
		// get all knob values as an object
		let uiSettings = this.getMixerValuesFromUI();


		synth.mixerSettings = {
			volume1: uiSettings.volume1,
			volume2: uiSettings.volume2,
			volume3: uiSettings.volume3
		};

	}

	getNoiseValuesFromUI() {
		const synth = this.getSynth();
		const enabled = {
			value: parseInt(this.root.getElementById('noise-switch').value),
			range: [0, 1]
		}

		const level = {
			value: parseInt(this.root.getElementById('knob-noise-level').value),
			range: [0, 100]
		}
		const type = {
			value: parseInt(this.root.getElementById('knob-noise-type').value),
			range: [0, 2]
		}


		return {
			enabled,
			level: transposeParam(level, [0, 1]),
			type
		}
	}

	setNoiseValues() {
		let synth = this.getSynth();
		// get all knob values as an object
		let uiSettings = this.getNoiseValuesFromUI();


		synth.noiseSettings = {
			enabled: uiSettings.enabled,
			level: uiSettings.level,
			type: uiSettings.type
		};
	}

	getEnvelopeValuesFromUI() {
		const synth = this.getSynth();
		const settings = synth.envelopesSettings;
		const primary = settings.primary;
		const filter = settings.filter;

		const primaryAttack = {
			value: parseInt(this.root.getElementById('env-primary-attack').value),
			range: [0, 100]
		}
		const primaryDecay = {
			value: parseInt(this.root.getElementById('env-primary-decay').value),
			range: [0, 100]
		}
		const primarySustain = {
			value: parseInt(this.root.getElementById('env-primary-sustain').value),
			range: [0, 100]
		}
		const primaryRelease = {
			value: parseInt(this.root.getElementById('env-primary-release').value),
			range: [0, 100]
		}

		const filterAttack = {
			value: parseInt(this.root.getElementById('env-filter-attack').value),
			range: [0, 100]
		}
		const filterDecay = {
			value: parseInt(this.root.getElementById('env-filter-decay').value),
			range: [0, 100]
		}
		const filterSustain = {
			value: parseInt(this.root.getElementById('env-filter-sustain').value),
			range: [0, 100]
		}
		const filterRelease = {
			value: parseInt(this.root.getElementById('env-filter-release').value),
			range: [0, 100]
		}

		return {
			primary: {
				attack: transposeParam(primaryAttack, [0, 2]),
				decay: transposeParam(primaryDecay, [0, 2]),
				sustain: transposeParam(primarySustain, [0.001, 1]),
				release: transposeParam(primaryRelease, [0, 2])
			},
			filter: {
				attack: transposeParam(filterAttack, [0, 2]),
				decay: transposeParam(filterDecay, [0.002, 2]),
				sustain: transposeParam(filterSustain, [0, 1]),
				release: transposeParam(filterRelease, [0, 2])
			}
		}
	}

	setEnvelopeValues() {
		let synth = this.getSynth();
		// get all knob values as an object
		let uiSettings = this.getEnvelopeValuesFromUI();

		synth.envelopes = {
			primary: uiSettings.primary,
			filter: uiSettings.filter
		};

	}


	getFilterValuesFromUI() {
		const synth = this.getSynth();
		const filter = synth.filterSettings;
		const cutoff = {
			value: parseInt(this.root.getElementById('knob-filter-cutoff').value),
			range: [0, 500]
		}
		const emphasis = {
			value: parseInt(this.root.getElementById('knob-filter-emphasis').value),
			range: [0, 100]
		}
		const envAmount = {
			value: parseInt(this.root.getElementById('knob-filter-env-amount').value),
			range: [0, 100]
		}

		return {
			cutoff: transposeParam(cutoff, [0, 8000]),
			emphasis: transposeParam(emphasis, [0.4, 40]),
			envAmount: transposeParam(envAmount, [0, 1])
		}
	}

	setFilterValues() {
		let synth = this.getSynth();
		// get all knob values as an object
		let uiSettings = this.getFilterValuesFromUI();

		synth.filterSettings = {
			cutoff: uiSettings.cutoff,
			emphasis: uiSettings.emphasis,
			envAmount: uiSettings.envAmount
		};


	}


	getLFOValuesFromUI() {
		const synth = this.getSynth();
		const lfo = synth.lfoSettings;
		const waveform = {
			value: parseInt(this.root.getElementById('knob-lfo-waveform').value),
			range: [0, 5]
		}
		const rate = {
			value: parseInt(this.root.getElementById('knob-lfo-rate').value),
			range: [0, 25]
		}
		const amount = {
			value: parseInt(this.root.getElementById('knob-lfo-amount').value),
			range: [0, 100]
		}

		return {
			waveform,
			rate: transposeParam(rate, [1, 25]),
			amount: transposeParam(amount, [0, 1])
		}
	}

	setLFOValues() {
		let synth = this.getSynth();
		// get all knob values as an object
		let uiSettings = this.getLFOValuesFromUI();

		synth.lfoSettings = {
			waveform: uiSettings.waveform,
			rate: uiSettings.rate,
			amount: uiSettings.amount
		};
	}

	getCompressorValuesFromUI() {
		let dawEngine = this.getDawEngine();
		const compressor = dawEngine.compressorSettings;

		const switchValue = parseInt(this.root.getElementById('compressor-switch').value);
		const enabled = {
			value: switchValue,
			range: [0, 1]
		}
		const threshold = {
			value: parseInt(this.root.getElementById('knob-compressor-threshold').value),
			range: [-60, 0]
		}
		const ratio = {
			value: parseInt(this.root.getElementById('knob-compressor-ratio').value),
			range: [1, 20]
		}
		const knee = {
			value: parseInt(this.root.getElementById('knob-compressor-knee').value),
			range: [0, 20]
		}
		const attack = {
			value: parseInt(this.root.getElementById('knob-compressor-attack').value),
			range: [0, 1000]
		}
		const release = {
			value: parseInt(this.root.getElementById('knob-compressor-release').value),
			range: [0, 1000]
		}
		const makeupGain = {
			value: parseInt(this.root.getElementById('knob-compressor-makeupGain').value),
			range: [0, 10]
		}

		return {
			enabled,
			threshold,
			ratio,
			knee,
			attack,
			release,
			makeupGain
		}
	}

	setCompressorValues() {
		let dawEngine = this.getDawEngine();
		// get all knob values as an object
		let uiSettings = this.getCompressorValuesFromUI();

		dawEngine.compressorSettings = {
			enabled: uiSettings.enabled,
			threshold: uiSettings.threshold,
			ratio: uiSettings.ratio,

			knee: uiSettings.knee,
			attack: uiSettings.attack,

			release: uiSettings.release,
			makeupGain: uiSettings.makeupGain
		};
		//console.dir affiche les objets
	}


	getReverbValuesFromUI() {
		let dawEngine = this.getDawEngine();
		const reverb = dawEngine.reverbSettings;
		const level = {
			value: parseInt(this.root.getElementById('knob-reverb-level').value),
			range: [0, 100]
		}

		return {
			level: transposeParam(level, [0, 1])
		}
	}

	setReverbValues() {
		let dawEngine = this.getDawEngine();
		// get all knob values as an object
		let uiSettings = this.getReverbValuesFromUI();

		dawEngine.reverbSettings = {
			level: uiSettings.level
		};
	}

	getDelayValuesFromUI() {
		let dawEngine = this.getDawEngine();
		const delay = dawEngine.delaySettings;
		const time = {
			value: parseInt(this.root.getElementById('knob-delay-time').value),
			range: [0, 100]
		}
		const feedback = {
			value: parseInt(this.root.getElementById('knob-delay-feedback').value),
			range: [0, 100]
		}
		const dry = {
			value: parseInt(this.root.getElementById('knob-delay-dry').value),
			range: [0, 100]
		}
		const wet = {
			value: parseInt(this.root.getElementById('knob-delay-wet').value),
			range: [0, 100]
		}

		return {
			time: transposeParam(time, [0, 1000]),
			feedback: transposeParam(feedback, [0, 0.9]),
			dry: transposeParam(dry, [0, 1]),
			wet: transposeParam(wet, [0, 1]),
		}
	}

	setDelayValues() {
		let dawEngine = this.getDawEngine();
		// get all knob values as an object
		let uiSettings = this.getDelayValuesFromUI();

		dawEngine.delaySettings = {
			time: uiSettings.time,
			feedback: uiSettings.feedback,
			dry: uiSettings.dry,
			wet: uiSettings.wet
		};
	}

	getModulationWheelValuesFromUI() {
		let dawEngine = this.getDawEngine();
		const modulationSettings = dawEngine.modulationSettings;

		const rate = {
			value: parseInt(this.root.getElementById('modulation-wheel').value),
			range: [0, 128]
		}

		return {
			rate: transposeParam(rate, [0, 15]) // voir buffa pk marche pas
		}
	}

	/*
				var modulationSettings = dawEngine.modulationSettings;

				modulationSettings.rate = settingsConvertor.transposeParam( self.modulation, settings.rate.range );

				dawEngine.modulationSettings = modulationSettings;
	*/
	setModulationWheelValues() {
		let dawEngine = this.getDawEngine();
		// get all knob values as an object
		let uiSettings = this.getModulationWheelValuesFromUI();

		dawEngine.modulationSettings = {
			rate: uiSettings.rate
		};

		//console.dir(dawEngine.modulationWheel);

	}

	getPitchBendValuesFromUI() {
		let dawEngine = this.getDawEngine();

		const bend = {
			value: parseInt(this.root.getElementById('pitch-bend-left').value),
			range: [0, 128]
		}

		return {
			bend: transposeParam(bend, [-200, 200]) // buffa pk marche pas
		}
	}

	setPitchBendValues() {
		let dawEngine = this.getDawEngine();
		// get all knob values as an object
		let uiSettings = this.getPitchBendValuesFromUI();

		dawEngine.pitchSettings = {
			bend: uiSettings.bend
		};

	}



	async setKnobs() {
		// Rangée du haut, colonne 1 POLYPHONY MODULATION
		// Attention, dans tous les écouteurs on doit modifier l'objet "modulationSettings complet, pas une seule propriété à la fois"
		this.root.getElementById('knob-modulation-waveform').addEventListener('input', (e) => {
			//console.log("On change la forme de la waveform val = " + e.target.value);

			this.setModulationValues();
		});

		// MODULATION top left column
		this.root.getElementById('knob-modulation-glide').addEventListener('input', (e) => {
			//console.log("On change la vzaleur glide/portamento + val = " + e.target.value);
			this.setModulationValues();
		});

		// POLYPHONY OK
		this.root.getElementById('knob-polyphony-voices').addEventListener('input', (e) => {
			//console.log("On change le nombre max de voix de polyphonie = " + e.target.value);

			const synth = this.getSynth();
			const settings = synth.polyphonySettings;
			synth.polyphonySettings = {
				voiceCount: {
					value: parseInt(e.target.value),
					range: [1, 10]
				},
				sustain: transposeParam(settings.sustain, [0, 1])
			};
		});

		// OSCILLATORS OK
		this.root.getElementById('knob-osc1-range').addEventListener('input', (e) => {
			this.setOscillatorValues();
		});
		this.root.getElementById('knob-osc1-waveform').addEventListener('input', (e) => {
			this.setOscillatorValues();
		});

		//osc2
		this.root.getElementById('knob-osc2-range').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'osc2 range + val = " + e.target.value);
			this.setOscillatorValues();
		});
		this.root.getElementById('knob-osc2-fine-detune').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'osc2 fine detune + val = " + e.target.value);
			this.setOscillatorValues();
		});
		this.root.getElementById('knob-osc2-waveform').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'osc2 waveform + val = " + e.target.value);
			this.setOscillatorValues();
		});

		//osc3
		this.root.getElementById('knob-osc3-range').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'osc3 range + val = " + e.target.value);
			this.setOscillatorValues();
		});
		this.root.getElementById('knob-osc3-fine-detune').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'osc3 fine detune + val = " + e.target.value);
			this.setOscillatorValues();
		});
		this.root.getElementById('knob-osc3-waveform').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'osc3 waveform + val = " + e.target.value);
			this.setOscillatorValues();
		});

		// MIXER OK
		this.root.getElementById('knob-mixer-volume-1').addEventListener('input', (e) => {
			//console.log("On change le volume du mixer 1 + val = " + e.target.value);
			this.setMixerValues();
		});
		this.root.getElementById('knob-mixer-volume-2').addEventListener('input', (e) => {
			//console.log("On change le volume du mixer 2 + val = " + e.target.value);
			this.setMixerValues();
		});
		this.root.getElementById('knob-mixer-volume-3').addEventListener('input', (e) => {
			//console.log("On change le volume du mixer 3 + val = " + e.target.value);
			this.setMixerValues();
		});

		// NOISE OK
		this.root.getElementById('knob-noise-level').addEventListener('input', (e) => {
			//console.log("On change le niveau de bruit + val = " + e.target.value);
			this.setNoiseValues();
		});
		this.root.getElementById('knob-noise-type').addEventListener('input', (e) => {
			//console.log("On change le type de bruit + val = " + e.target.value);
			this.setNoiseValues();
		});
		this.root.getElementById('noise-switch').addEventListener('change', (e) => {
			//console.log("On change le switch de bruit + val = " + e.target.value);
			this.setNoiseValues();
		});

		// ENVELOPES
		this.root.getElementById('env-primary-attack').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'attaque de l'enveloppe primaire + val = " + e.target.value);
			this.setEnvelopeValues();
		});
		this.root.getElementById('env-primary-decay').addEventListener('input', (e) => {
			//console.log("On change la valeur du decay de l'enveloppe primaire + val = " + e.target.value);
			this.setEnvelopeValues();
		});
		this.root.getElementById('env-primary-sustain').addEventListener('input', (e) => {
			//console.log("On change la valeur du sustain de l'enveloppe primaire + val = " + e.target.value);
			this.setEnvelopeValues();
		});
		this.root.getElementById('env-primary-release').addEventListener('input', (e) => {
			//console.log("On change la valeur du release de l'enveloppe primaire + val = " + e.target.value);
			this.setEnvelopeValues();
		});

		this.root.getElementById('env-filter-attack').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'attaque de l'enveloppe de filtre + val = " + e.target.value);
			this.setEnvelopeValues();
		});
		this.root.getElementById('env-filter-decay').addEventListener('input', (e) => {
			//console.log("On change la valeur du decay de l'enveloppe de filtre + val = " + e.target.value);
			this.setEnvelopeValues();
		});
		this.root.getElementById('env-filter-sustain').addEventListener('input', (e) => {
			//console.log("On change la valeur du sustain de l'enveloppe de filtre + val = " + e.target.value);
			this.setEnvelopeValues();
		});
		this.root.getElementById('env-filter-release').addEventListener('input', (e) => {
			//console.log("On change la valeur du release de l'enveloppe de filtre + val = " + e.target.value);
			this.setEnvelopeValues();
		});

		// FILTER OK
		this.root.getElementById('knob-filter-cutoff').addEventListener('input', (e) => {
			//console.log("On change la valeur du cutoff du filtre + val = " + e.target.value);
			this.setFilterValues();
		});
		this.root.getElementById('knob-filter-emphasis').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'emphasis du filtre + val = " + e.target.value);
			this.setFilterValues();
		});
		this.root.getElementById('knob-filter-env-amount').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'amount du filtre + val = " + e.target.value);
			this.setFilterValues();
		});

		// LFO OK
		this.root.getElementById('knob-lfo-waveform').addEventListener('input', (e) => {
			//console.log("On change la valeur de la waveform du LFO + val = " + e.target.value);
			this.setLFOValues();
		});
		this.root.getElementById('knob-lfo-rate').addEventListener('input', (e) => {
			//console.log("On change la valeur du rate du LFO + val = " + e.target.value);
			this.setLFOValues();
		});
		this.root.getElementById('knob-lfo-amount').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'amount du LFO + val = " + e.target.value);
			this.setLFOValues();
		});


		// COMPRESSOR OK
		this.root.getElementById('compressor-switch').addEventListener('change', (e) => {
			//console.log("On change le switch du compresseur + val = " + e.target.value);
			this.setCompressorValues();
		});
		this.root.getElementById('knob-compressor-threshold').addEventListener('input', (e) => {
			//console.log("On change la valeur du threshold du compresseur + val = " + e.target.value);
			this.setCompressorValues();
		});
		this.root.getElementById('knob-compressor-ratio').addEventListener('input', (e) => {
			//console.log("On change la valeur du ratio du compresseur + val = " + e.target.value);
			this.setCompressorValues();
		});
		this.root.getElementById('knob-compressor-knee').addEventListener('input', (e) => {
			//console.log("On change la valeur du knee du compresseur + val = " + e.target.value);
			this.setCompressorValues();
		});
		this.root.getElementById('knob-compressor-attack').addEventListener('input', (e) => {
			//console.log("On change la valeur de l'attack du compresseur + val = " + e.target.value);
			this.setCompressorValues();
		});
		this.root.getElementById('knob-compressor-release').addEventListener('input', (e) => {
			//console.log("On change la valeur du release du compresseur + val = " + e.target.value);
			this.setCompressorValues();
		});
		this.root.getElementById('knob-compressor-makeupGain').addEventListener('input', (e) => {
			//console.log("On change la valeur du makeupGain du compresseur + val = " + e.target.value);
			this.setCompressorValues();
		});

		// REVERB OK
		this.root.getElementById('knob-reverb-level').addEventListener('input', (e) => {
			//console.log("On change le level du reverb + val = " + e.target.value);
			this.setReverbValues();
		});

		// DELAY OK
		this.root.getElementById('knob-delay-time').addEventListener('input', (e) => {
			//console.log("On change le time du delay + val = " + e.target.value);
			this.setDelayValues();
		});
		this.root.getElementById('knob-delay-feedback').addEventListener('input', (e) => {
			//console.log("On change le feedback du delay + val = " + e.target.value);
			this.setDelayValues();
		});
		this.root.getElementById('knob-delay-dry').addEventListener('input', (e) => {
			//console.log("On change le dry du delay + val = " + e.target.value);
			this.setDelayValues();
		});
		this.root.getElementById('knob-delay-wet').addEventListener('input', (e) => {
			//console.log("On change le wet du delay + val = " + e.target.value);
			this.setDelayValues();
		});

		// MODULATION WHEEL
		this.root.getElementById('modulation-wheel').addEventListener('input', (e) => {
			//console.log("On change la valeur de la modulation wheel + val = " + e.target.value);
			this.setModulationWheelValues();
		});

		// PITCH BEND
		this.root.getElementById('pitch-bend-left').addEventListener('input', (e) => {
			//console.log("On change la valeur du pitch bend + val = " + e.target.value);
			this.setPitchBendValues();
		});

		// Master Volume
		this.root.getElementById('masterVolume').addEventListener('input', (e) => {
			const level = {
				value: parseInt(e.target.value),
				range: [0, 100]
			}

			console.log("On change le master vol du plugin + val = " + e.target.value);
			const dawEngine = this.getDawEngine();

			dawEngine.masterVolumeSettings = {
				level: transposeParam(level, [0, 1])
			};
		});

		// KEYBOARDS
		this.root.getElementById('piano-keyboard').addEventListener('change', (e) => {
			const dawEngine = this.getDawEngine();
			let isNoteOn = e.note[0];
			let noteNumber = e.note[1];

			if (e.note[0])
				console.log("Note-On:" + e.note[1]);
			else
				console.log("Note-Off:" + e.note[1]);

			var midiMessage = this.produceMidiMessage(
				isNoteOn ? 144 : 128,
				noteNumber,
				100);

			dawEngine.externalMidiMessage(midiMessage);
		});
	}

	produceMidiMessage(firstByte, secondByte, thirdByte) {
		return {
			data: [firstByte, secondByte, thirdByte]
		};
	};

	setSwitchListener() {

	}

	// name of the custom HTML element associated
	// with the plugin. Will appear in the DOM if
	// the plugin is visible
	static is() {
		return 'wimmics-viktor-synth';
	}
}

if (!customElements.get(ViktorNV1HTMLElement.is())) {
	customElements.define(
		ViktorNV1HTMLElement.is(),
		ViktorNV1HTMLElement
	);
}