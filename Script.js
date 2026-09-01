/* =================================================
   TAB SYSTEM
================================================= */

function showTab(id, button){

    document
        .querySelectorAll(".section")
        .forEach(section => {
            section.classList.add("hidden");
        });

    document
        .getElementById(id)
        .classList.remove("hidden");

    document
        .querySelectorAll(".tab")
        .forEach(tab => {
            tab.classList.remove("active");
        });

    button.classList.add("active");
}


/* =================================================
   SCIENTIFIC CALCULATOR
================================================= */

const display =
    document.getElementById("display");


function addValue(value){

    display.value += value;

    display.focus();
}


function clearCalc(){

    display.value = "";

}


function deleteLast(){

    display.value =
        display.value.slice(0,-1);

}


function factorial(n){

    if(n < 0 || !Number.isInteger(n)){
        throw new Error("Invalid factorial");
    }

    let result = 1;

    for(let i = 2; i <= n; i++){

        result *= i;

    }

    return result;
}


function calculate(){

    let expression =
        display.value.trim();

    if(!expression) return;


    try{

        expression = expression

            .replace(/π/g,"Math.PI")

            .replace(/√/g,"Math.sqrt")

            .replace(
                /sin\s*([0-9.]+)/g,
                "Math.sin($1*Math.PI/180)"
            )

            .replace(
                /cos\s*([0-9.]+)/g,
                "Math.cos($1*Math.PI/180)"
            )

            .replace(
                /tan\s*([0-9.]+)/g,
                "Math.tan($1*Math.PI/180)"
            )

            .replace(
                /log\s*([0-9.]+)/g,
                "Math.log10($1)"
            )

            .replace(
                /ln\s*([0-9.]+)/g,
                "Math.log($1)"
            )

            .replace(/\^/g,"**")

            .replace(
                /(\d+(?:\.\d+)?)!/g,
                "factorial($1)"
            )

            .replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );


        const result =
            Function(
                "factorial",
                '"use strict"; return (' +
                expression +
                ')'
            )(factorial);


        if(!Number.isFinite(result)){
            throw new Error();
        }


        const finalResult =
            Math.round(result * 1e12) / 1e12;


        const old =
            display.value;


        display.value =
            finalResult;


        const history =
            document.getElementById("history");


        const item =
            document.createElement("p");


        item.textContent =
            old + " = " + finalResult;


        history.prepend(item);


    }catch(error){

        display.value = "Error";

        setTimeout(() => {
            display.value = "";
        },800);

    }
}


display.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Enter"){

            event.preventDefault();

            calculate();

        }

        if(event.key === "Escape"){

            clearCalc();

        }

    }
);


/* =================================================
   FORMULA DATABASE
================================================= */

const formulas = {

    ohm:{
        equation:"V = I × R",

        fields:[
            ["I","Current (A)"],
            ["R","Resistance (Ω)"]
        ],

        calculate:v =>
            `Voltage = ${(v.I*v.R).toFixed(4)} V`
    },


    power:{
        equation:"P = V × I",

        fields:[
            ["V","Voltage (V)"],
            ["I","Current (A)"]
        ],

        calculate:v =>
            `Power = ${(v.V*v.I).toFixed(4)} W`
    },


    resistance:{
        equation:"R = V / I",

        fields:[
            ["V","Voltage (V)"],
            ["I","Current (A)"]
        ],

        calculate:v =>
            `Resistance = ${(v.V/v.I).toFixed(4)} Ω`
    },


    current:{
        equation:"I = V / R",

        fields:[
            ["V","Voltage (V)"],
            ["R","Resistance (Ω)"]
        ],

        calculate:v =>
            `Current = ${(v.V/v.R).toFixed(4)} A`
    },


    energy:{
        equation:"E = P × t",

        fields:[
            ["P","Power (W)"],
            ["t","Time (hour)"]
        ],

        calculate:v =>
            `Energy = ${(v.P*v.t).toFixed(4)} Wh`
    },


    charge:{
        equation:"Q = I × t",

        fields:[
            ["I","Current (A)"],
            ["t","Time (s)"]
        ],

        calculate:v =>
            `Charge = ${(v.I*v.t).toFixed(4)} C`
    },


    xl:{
        equation:"XL = 2πfL",

        fields:[
            ["f","Frequency (Hz)"],
            ["L","Inductance (H)"]
        ],

        calculate:v =>
            `XL = ${(2*Math.PI*v.f*v.L).toFixed(4)} Ω`
    },


    xc:{
        equation:"XC = 1/(2πfC)",

        fields:[
            ["f","Frequency (Hz)"],
            ["C","Capacitance (F)"]
        ],

        calculate:v =>
            `XC = ${(1/(2*Math.PI*v.f*v.C)).toFixed(4)} Ω`
    },


    resonance:{
        equation:"f₀ = 1/(2π√LC)",

        fields:[
            ["L","Inductance (H)"],
            ["C","Capacitance (F)"]
        ],

        calculate:v =>
            `Resonant Frequency = ${
                (1/(2*Math.PI*Math.sqrt(v.L*v.C)))
                .toFixed(4)
            } Hz`
    },


    rms:{
        equation:"Vrms = Vp/√2",

        fields:[
            ["Vp","Peak Voltage (V)"]
        ],

        calculate:v =>
            `Vrms = ${(v.Vp/Math.sqrt(2)).toFixed(4)} V`
    },


    threephase:{
        equation:"P = √3 × V × I × cosφ",

        fields:[
            ["V","Line Voltage (V)"],
            ["I","Line Current (A)"],
            ["pf","Power Factor"]
        ],

        calculate:v =>
            `Power = ${
                (Math.sqrt(3)*v.V*v.I*v.pf)
                .toFixed(4)
            } W`
    },


    efficiency:{
        equation:"η = Output/Input × 100",

        fields:[
            ["output","Output"],
            ["input","Input"]
        ],

        calculate:v =>
            `Efficiency = ${
                (v.output/v.input*100)
                .toFixed(4)
            } %`
    },


    slip:{
        equation:"s = (Ns - N)/Ns",

        fields:[
            ["Ns","Synchronous Speed (RPM)"],
            ["N","Rotor Speed (RPM)"]
        ],

        calculate:v =>
            `Slip = ${
                ((v.Ns-v.N)/v.Ns*100)
                .toFixed(4)
            } %`
    },


    syncspeed:{
        equation:"Ns = 120f/P",

        fields:[
            ["f","Frequency (Hz)"],
            ["P","Number of Poles"]
        ],

        calculate:v =>
            `Synchronous Speed = ${
                (120*v.f/v.P)
                .toFixed(4)
            } RPM`
    },


    transformer:{
        equation:"V1/V2 = N1/N2",

        fields:[
            ["V1","Primary Voltage (V)"],
            ["N1","Primary Turns"],
            ["N2","Secondary Turns"]
        ],

        calculate:v =>
            `Secondary Voltage = ${
                (v.V1*v.N2/v.N1)
                .toFixed(4)
            } V`
    },


    torque:{
        equation:"T = P/ω",

        fields:[
            ["P","Power (W)"],
            ["rpm","Speed (RPM)"]
        ],

        calculate:v => {

            const omega =
                2*Math.PI*v.rpm/60;

            return `Torque = ${
                (v.P/omega)
                .toFixed(4)
            } N·m`;
        }
    }

};


/* =================================================
   LOAD FORMULA
================================================= */

function loadFormula(){

    const type =
        document.getElementById(
            "formulaSelect"
        ).value;

    const container =
        document.getElementById(
            "formulaInputs"
        );

    const result =
        document.getElementById(
            "formulaResult"
        );


    container.innerHTML = "";


    if(!type){

        result.innerHTML =
            "Select a formula to begin.";

        return;
    }


    const formula =
        formulas[type];


    container.innerHTML = `

        <div class="formula-equation">
            ${formula.equation}
        </div>

        <div class="formula-grid">

            ${
                formula.fields.map(field => `

                    <div class="field">

                        <label>
                            ${field[1]}
                        </label>

                        <input
                            type="number"
                            step="any"
                            id="f_${field[0]}"
                            placeholder="${field[1]}"
                        >

                    </div>

                `).join("")
            }

        </div>
    `;
}


/* =================================================
   CALCULATE FORMULA
================================================= */

function calculateFormula(){

    const type =
        document.getElementById(
            "formulaSelect"
        ).value;

    const result =
        document.getElementById(
            "formulaResult"
        );


    if(!type){

        result.innerHTML =
            "⚠️ Select a formula.";

        return;
    }


    const formula =
        formulas[type];


    const values = {};


    for(const field of formula.fields){

        const input =
            document.getElementById(
                "f_" + field[0]
            );


        values[field[0]] =
            parseFloat(input.value);


        if(isNaN(values[field[0]])){

            result.innerHTML =
                "⚠️ Enter all values.";

            return;
        }
    }


    try{

        result.innerHTML =
            "✅ " + formula.calculate(values);

    }catch(error){

        result.innerHTML =
            "⚠️ Invalid values.";

    }
}


/* =================================================
   CLEAR FORMULA
================================================= */

function clearFormula(){

    document.getElementById(
        "formulaSelect"
    ).value = "";

    document.getElementById(
        "formulaInputs"
    ).innerHTML = "";

    document.getElementById(
        "formulaResult"
    ).innerHTML =
        "Select a formula to begin.";
}


/* =================================================
   OHM'S LAW QUICK CALCULATOR
================================================= */

function calculateOhm(){

    const V =
        parseFloat(
            document.getElementById("ohmV").value
        );

    const I =
        parseFloat(
            document.getElementById("ohmI").value
        );

    const R =
        parseFloat(
            document.getElementById("ohmR").value
        );


    const result =
        document.getElementById("ohmResult");


    /* V = IR */

    if(isNaN(V) && !isNaN(I) && !isNaN(R)){

        const answer = I * R;

        document.getElementById("ohmV").value =
            answer;

        result.innerHTML =
            `Voltage = ${answer.toFixed(4)} V`;

        return;
    }


    /* I = V/R */

    if(!isNaN(V) && isNaN(I) && !isNaN(R)){

        if(R === 0){

            result.innerHTML =
                "⚠️ Resistance cannot be zero.";

            return;
        }

        const answer = V / R;

        document.getElementById("ohmI").value =
            answer;

        result.innerHTML =
            `Current = ${answer.toFixed(4)} A`;

        return;
    }


    /* R = V/I */

    if(!isNaN(V) && !isNaN(I) && isNaN(R)){

        if(I === 0){

            result.innerHTML =
                "⚠️ Current cannot be zero.";

            return;
        }

        const answer = V / I;

        document.getElementById("ohmR").value =
            answer;

        result.innerHTML =
            `Resistance = ${answer.toFixed(4)} Ω`;

        return;
    }


    if(!isNaN(V) && !isNaN(I) && !isNaN(R)){

        const expected =
            I * R;


        if(Math.abs(V-expected) < 0.0001){

            result.innerHTML =
                "✅ Values are consistent.";

        }else{

            result.innerHTML =
                `⚠️ Expected Voltage = ${
                    expected.toFixed(4)
                } V`;

        }

        return;
    }


    result.innerHTML =
        "⚠️ Enter any TWO values.";
}
