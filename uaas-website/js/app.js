/* Ultra Automation Solutions
 * Main application
 */


/* =========================================================
   COMPANY
========================================================= */

var PH = "919962833203";
var EM = "uaas.india@gmail.com";
var UAAS_API_BASE = "https://uaas-api.onrender.com"; // local development only


/* =========================================================
   SUPPORTED BRANDS
   Based on the company brochure.
========================================================= */

var BR = [
  "ABB",
  "Actech",
  "Allen-Bradley",
  "B&R",
  "Baumuller",
  "CG / Crompton Greaves",
  "Bosch Rexroth",
  "GE Drives",
  "Fuji Electric",
  "Danfoss",
  "Delta",
  "Emerson",
  "Fanuc",
  "Omron",
  "Lenze",
  "Panasonic",
  "Mitsubishi",
  "Moog",
  "KEB",
  "L&T",
  "Kirloskar",
  "Golden Age",
  "Gefran",
  "Hilectro",
  "Hitachi",
  "Inovance",
  "Kollmorgen",
  "INVT",
  "THM",
  "Vacon",
  "Siemens",
  "Schneider Electric",
  "Toshiba",
  "Yaskawa",
  "KEBA",
  "Chinese Drives"
];


/* =========================================================
   MAIN SERVICES
========================================================= */

/*var SV = [

  [
    "VFD and AC drive repair",
    "Component-level fault diagnosis, repair and testing of industrial drives."
  ],

  [
    "Servo drive and motor repair",
    "Servo amplifiers, servo motors and feedback systems."
  ],

  [
    "PLC and HMI repair",
    "PLC CPUs, I/O modules, HMI panels and control systems."
  ],

  [
    "Robot controller service",
    "Robot controller cards, teach pendants and axis amplifiers."
  ],

  [
    "Installation and commissioning",
    "Industrial automation installation, commissioning and handover."
  ],

  [
    "Maintenance and servicing",
    "Planned maintenance and breakdown support."
  ],

  [
    "System design and integration",
    "Process control and complete industrial automation solutions."
  ],

  [
    "Spares supply",
    "Industrial automation components and spare parts."
  ]

];*/
var SV = [
  [
    "VFD and AC drive repair",
    "Component-level fault diagnosis, repair and testing of industrial drives.",
    "vfd"
  ],

  [
    "Servo drive and motor repair",
    "Servo amplifiers, servo motors and feedback systems.",
    "servo"
  ],

  [
  "PLC and HMI repair",
  "PLC CPUs, I/O modules, HMI panels and control systems.",
  "plc"
],


 /* [
    "Robot controller service",
    "Robot controller cards, teach pendants and axis amplifiers."
  ],*/
  [
    "Spares supply",
    "Industrial automation components and spare parts.",
    "spares"
  ],
  [
    "Installation and commissioning",
    "Industrial automation installation, commissioning and handover."
  ],

  [
    "Maintenance and servicing",
    "Planned maintenance and breakdown support."
  ],

  [
    "System design and integration",
    "Process control and complete industrial automation solutions."
  ],

  /*[
    "Spares supply",
    "Industrial automation components and spare parts.",
    "spares"
  ]*/
  [
    "Robot controller service",
    "Robot controller cards, teach pendants and axis amplifiers."
  ]
];
var PLC_COMPANIES = [
  ["SIEMENS", "images/plc/siemens.jpg"],
  ["INOVANCE", "images/plc/inovance.jpg"],
  ["B&R", "images/plc/br.jpg"],
  ["SCHNEIDER ELECTRIC", "images/plc/schneider.jpg"],
  ["MITSUBISHI", "images/plc/mitsubishi.jpg"],
  ["OMRON", "images/plc/omron.jpg"],
  ["DELTA ELECTRONICS", "images/plc/delta.jpg"],
  ["TECHMATION", "images/plc/techmation.jpg"]
];

var VFD_COMPANIES = [
  ["ABB", "images/vfd/abb.jpg.png"],
  ["DELTA", "images/vfd/delta.jpg"],
  ["DANFOSS", "images/vfd/danfoss.jpg"],
  ["FUJI", "images/vfd/fuji.jpg"],
  ["KEB", "images/vfd/keb.jpg"],
  ["L&T", "images/vfd/lt.jpg"],
  ["INVT", "images/vfd/invt.jpg"],
  ["INOVANCE", "images/vfd/inovance.jpg"],
  ["GEFRAN", "images/vfd/gefran.jpg"],
  //["MITSUBISHI", "images/vfd/mitsubishi.jpg"],
  ["MOOG", "images/vfd/moog.jpg"],
  //["NIDEC", "images/vfd/nidec.jpg"],
  //["PANASONIC", "images/vfd/panasonic.jpg"],
  ["SCHNEIDER ELECTRIC", "images/vfd/schneider.jpg"],
  //["THM", "images/vfd/thm.jpg"],
  ["TECHMATION", "images/vfd/techmation.jpg"],
  //["GOLDEN AGE", "images/vfd/golden-age.jpg"],
  ["PHASE MOTORS", "images/vfd/phase-motors.jpg"],
  ["SIEMENS", "images/vfd/siemens.jpg"],
  ["BOSCH REXROTH", "images/vfd/bosch-rexroth.jpg"],
  ["BAUMULLER", "images/vfd/baumuller.jpg"],
  ["TOSHIBA", "images/vfd/toshiba.jpg"],
  ["YASKAWA", "images/vfd/yaskawa.jpg"],
  ["ALL CHINESE DRIVES", "images/vfd/chinese-drives.jpg"]
];

var SERVO_COMPANIES = [
  ["ABB", "images/servo/abb.jpg"],
  ["DELTA", "images/servo/delta.jpg"],
  ["DANFOSS", "images/servo/danfoss.jpg"],
  ["FUJI", "images/servo/fuji.jpg"],
  ["KEB", "images/servo/keb.jpg"],
  ["L&T", "images/servo/lt.jpg"],
  ["INVT", "images/servo/invt.jpg"],
  ["INOVANCE", "images/servo/inovance.jpg"],
  ["GEFRAN", "images/servo/gefran.jpg"],
  //["MITSUBISHI", "images/servo/mitsubishi.jpg"],
  ["MOOG", "images/servo/moog.jpg"],
  ["NIDEC", "images/servo/nidec.jpg"],
  ["PANASONIC", "images/servo/panasonic.jpg"],
  ["SCHNEIDER ELECTRIC", "images/servo/schneider.jpg"],
  ["THM", "images/servo/thm.jpg"],
  //["TECHMATION", "images/servo/techmation.jpg"],
  //["GOLDEN AGE", "images/servo/golden-age.jpg"],
  ["PHASE MOTORS", "images/servo/phase-motors.jpg"],
  ["SIEMENS", "images/servo/siemens.jpg"],
  ["BOSCH REXROTH", "images/servo/bosch-rexroth.jpg"],
  ["BAUMULLER", "images/servo/baumuller.jpg"],
  //["TOSHIBA", "images/servo/toshiba.jpg"],
  ["YASKAWA", "images/servo/yaskawa.jpg"],
  ["ALL CHINESE DRIVES", "images/servo/chinese-drives.jpg"]
];
var SPARES_COMPANIES = [
    ["INDUSTRIAL FANS", "images/spares/industrial-fans.jpg"],
    ["DC FANS", "images/spares/dc-fans.jpg"],
    ["AC FANS", "images/spares/ac-fans.jpg"],
    ["RESOLVER", "images/spares/resolver.jpg"],
    ["CABLES", "images/spares/cables.jpg"]
];



/* =========================================================
   RETROFIT / CONVERSION SERVICES
========================================================= */

var RT = [
  [
    "Injection moulding: non-servo to servo conversion",
    "Upgrade conventional injection moulding systems to servo-based operation.",
    "rt1"
  ],

  [
    "Injection moulding: PLC conversion",
    "PLC modernization and control-system conversion.",
    "rt2"
  ],

  /*[
    "Injection moulding: robotic arm conversion",
    "Automation and robotic-arm conversion solutions.",
    "rt3"
  ],*/

  [
    "VFD / AC drive retrofit",
    "Drive replacement, retrofit and application development.",
    "rt4"
  ],

  [
    "Servo drive and motor conversion",
    "Servo drive and servo motor conversion solutions.",
    "rt5"
  ],

  [
    "PLC and HMI retrofit",
    "PLC/HMI modernization and application development.",
    "rt6"
  ]
];
var RT_COMPANIES = {
  rt1: [
  ["ABB", "images/retrofit/non-servo-to-servo/abb.jpg"],
  ["KEB", "images/retrofit/non-servo-to-servo/keb.jpg"],
  ["Inovance", "images/retrofit/non-servo-to-servo/inovance.jpg"],
  ["Delta", "images/retrofit/non-servo-to-servo/delta.jpg"],
  ["Siemens", "images/retrofit/non-servo-to-servo/siemens.jpg"],
  ["Schneider", "images/retrofit/non-servo-to-servo/schneider.jpg"],
 // ["Yaskawa", "images/retrofit/non-servo-to-servo/yaskawa.jpg"],
  //["Mitsubishi", "images/retrofit/non-servo-to-servo/mitsubishi.jpg"]
],

  rt2: [
  ["Siemens", "images/retrofit/plc-conversion/siemens.jpg"],
  //["Mitsubishi", "images/retrofit/plc-conversion/mitsubishi.jpg"],
  ["Delta", "images/retrofit/plc-conversion/delta.jpg"],
  ["Omron", "images/retrofit/plc-conversion/omron.jpg"],
  ["Schneider", "images/retrofit/plc-conversion/schneider.jpg"],
  ["Inovance", "images/retrofit/plc-conversion/inovance.jpg"],
 // ["Allen-Bradley", "images/retrofit/plc-conversion/allen-bradley.jpg"]
],

  rt4: [
  ["ABB", "images/retrofit/vfd-ac-drive/abb.jpg"],
  ["KEB", "images/retrofit/vfd-ac-drive/keb.jpg"],
  ["Inovance", "images/retrofit/vfd-ac-drive/inovance.jpg"],
  ["Siemens", "images/retrofit/vfd-ac-drive/siemens.jpg"],
  ["Schneider", "images/retrofit/vfd-ac-drive/schneider.jpg"],
  //["Yaskawa", "images/retrofit/vfd-ac-drive/yaskawa.jpg"],
  ["Delta", "images/retrofit/vfd-ac-drive/delta.jpg"],
  ["Fuji Electric", "images/retrofit/vfd-ac-drive/fuji.jpg"],
  ["Danfoss", "images/retrofit/vfd-ac-drive/danfoss.jpg"]
],

  rt5: [
  //["Yaskawa", "images/retrofit/servo-drive-motor/yaskawa.jpg"],
  //["Mitsubishi", "images/retrofit/servo-drive-motor/mitsubishi.jpg"],
  ["Siemens", "images/retrofit/servo-drive-motor/siemens.jpg"],
  ["Delta", "images/retrofit/servo-drive-motor/delta.jpg"],
  ["Inovance", "images/retrofit/servo-drive-motor/inovance.jpg"],
  ["Panasonic", "images/retrofit/servo-drive-motor/panasonic.jpg"],
  ["Schneider", "images/retrofit/servo-drive-motor/schneider.jpg"],
  ["Bosch Rexroth", "images/retrofit/servo-drive-motor/bosch-rexroth.jpg"],
 // ["Kollmorgen", "images/retrofit/servo-drive-motor/kollmorgen.jpg"]
],

  rt6: [
  ["Siemens", "images/retrofit/plc-hmi/siemens.jpg"],
  //["Mitsubishi", "images/retrofit/plc-hmi/mitsubishi.jpg"],
  //["Allen-Bradley", "images/retrofit/plc-hmi/allen-bradley.jpg"],
  ["Schneider", "images/retrofit/plc-hmi/schneider.jpg"],
  ["Omron", "images/retrofit/plc-hmi/omron.jpg"],
  ["Delta", "images/retrofit/plc-hmi/delta.jpg"],
  ["Inovance", "images/retrofit/plc-hmi/inovance.jpg"],
  //["Beckhoff", "images/retrofit/plc-hmi/beckhoff.jpg"]
]
};



/* =========================================================
   COMPONENT LEVEL REPAIR
========================================================= */

var RP = [

  [
    "PCB component-level repair",
    "Board-level fault finding and component replacement."
  ],

  [
    "IGBT and power module repair",
    "Diagnosis of industrial drive power-stage components."
  ],

  [
    "Control card repair",
    "Repair and testing of industrial automation control boards."
  ],

  [
    "Power supply repair",
    "Industrial power supply and SMPS troubleshooting."
  ],

  [
    "Servo amplifier board repair",
    "Fault diagnosis and repair of servo amplifier boards."
  ],

  [
    "Encoder and feedback troubleshooting",
    "Resolvers, encoders and alignment-related service support."
  ],

  [
    "Industrial electronics repair",
    "Component-level troubleshooting for automation electronics."
  ]

];


/* =========================================================
   INDUSTRIES
========================================================= */

var IN = [
  "Textile",
  "Automobile",
  "Paper and Printing",
  "Plastic",
  "Pharma"
];

var INDUSTRY_INFO = {

  "Textile": {
    title: "TEXTILE INDUSTRY",
    description: "Automation solutions for textile manufacturing and processing.",
    applications: [
      "VFD and AC drive systems",
      "Servo drive systems",
      "PLC and HMI automation",
      "Motor control and retrofit",
      "Industrial electronics repair"
    ]
  },

  "Automobile": {
    title: "AUTOMOBILE INDUSTRY",
    description: "Industrial automation solutions for automotive manufacturing and production systems.",
    applications: [
      "PLC and HMI systems",
      "Servo drives and motors",
      "VFD systems",
      "Robotic automation",
      "Control panel systems"
    ]
  },

  "Paper and Printing": {
    title: "PAPER AND PRINTING INDUSTRY",
    description: "Automation and drive solutions for paper processing and printing machinery.",
    applications: [
      "AC drive systems",
      "Servo systems",
      "PLC automation",
      "Motor control",
      "Machine retrofit"
    ]
  },

  "Plastic": {
    title: "PLASTIC INDUSTRY",
    description: "Automation solutions for plastic processing and injection moulding machinery.",
    applications: [
      "Injection moulding automation",
      "Non-servo to servo conversion",
      "PLC conversion",
      "VFD and servo drives",
      "Robotic arm conversion"
    ]
  },

  "Pharma": {
    title: "PHARMA INDUSTRY",
    description: "Automation and control solutions for pharmaceutical manufacturing equipment.",
    applications: [
      "PLC and HMI automation",
      "Servo systems",
      "VFD systems",
      "Process control",
      "Industrial electronics repair"
    ]
  }

};


/* =========================================================
   SPARES / ACCESSORIES
========================================================= */

var P = [

  [
    "Encoders",
    "Sensing",
    "Industrial rotary and feedback encoders for accurate position, speed and motion feedback in automation systems."
  ],

  [
    "Pressure Transducers",
    "Sensing",
    "Industrial pressure transducers for reliable pressure measurement and monitoring in hydraulic, pneumatic and process applications."
  ],

  [
    "DC Cooling Fans",
    "Cooling",
    "Industrial DC cooling fans designed for efficient thermal management of VFDs, servo drives, control panels and electronic equipment."
  ],

  [
    "AC Cooling Fans",
    "Cooling",
    "Industrial AC cooling fans for continuous and reliable ventilation of electrical control cabinets and automation equipment."
  ],

  [
    "AC Blowers",
    "Cooling",
    "Industrial AC blowers for high-volume air circulation and effective cooling of electrical panels, drives and industrial machinery."
  ],

  [
    "AC Centrifugal Fans",
    "Cooling",
    "High-performance AC centrifugal fans for controlled airflow, equipment cooling and industrial ventilation applications."
  ],

  [
    "Switch Mode Power Supplies",
    "Power",
    "Industrial SMPS units for stable and regulated DC power supply to PLCs, HMIs, sensors, control circuits and automation equipment."
  ],

  [
    "Sensors",
    "Sensing",
    "Industrial sensors for reliable detection and measurement of position, proximity, temperature, pressure and machine operating conditions."
  ],

  [
    "IGBTs",
    "Power",
    "High-power IGBT components for industrial drives, inverters, power conversion systems and motor control applications."
  ],

  [
    "Power Modules",
    "Power",
    "Industrial power semiconductor modules for reliable switching and power conversion in VFDs, servo drives and industrial equipment."
  ],

  [
    "Dynamic Braking Resistors",
    "Power",
    "High-power dynamic braking resistors for dissipating regenerative energy and safely controlling motor deceleration in drive systems."
  ],

  [
    "Power Cables",
    "Cables",
    "Industrial-grade power cables designed for reliable electrical power transmission in motors, drives, control panels and machinery."
  ],

  [
    "Encoder Cables",
    "Cables",
    "Shielded encoder and feedback cables designed for reliable signal transmission between motors, encoders, servo drives and control systems."
  ],

  [
    "Single-Phase Motor Controllers",
    "Control",
    "Motor control devices for efficient operation, switching and protection of single-phase industrial motors and equipment."
  ],

  [
    "Three-Phase Motor Controllers",
    "Control",
    "Industrial three-phase motor controllers for reliable motor switching, control and integration with automation systems."
  ],

  [
    "Input EMI / EMC Filters",
    "Control",
    "EMI and EMC filters designed to reduce electrical noise and interference and improve the reliability of industrial automation equipment."
  ],

  [
    "Rotex Couplers",
    "Mechanical",
    "Flexible industrial shaft couplers for reliable torque transmission and mechanical connection between motors, gearboxes and driven equipment."
  ],

  [
    "Bell Housings",
    "Mechanical",
    "Industrial bell housings for accurate mechanical alignment and secure coupling of motors, gearboxes and machine assemblies."
  ],

  [
    "Motor Flanges",
    "Mechanical",
    "Precision motor mounting flanges for secure installation, alignment and mechanical integration of motors with industrial machinery."
  ],

  [
    "Connectors",
    "Control",
    "Industrial electrical connectors for secure and reliable connections between automation devices, control panels, sensors, drives and machinery."
  ]

];

/* =========================================================
   STATUS
========================================================= */

var ST = [
  "Received",
  "Diagnosed",
  "Quote issued",
  "Approved",
  "Under repair",
  "Tested",
  "Dispatched"
];


/* =========================================================
   HELPERS
========================================================= */

var $ = function (id) {
  return document.getElementById(id);
};


function el(tag, cls, text) {

  var e = document.createElement(tag);

  if (cls) {
    e.className = cls;
  }

  if (text !== undefined && text !== null) {
    e.textContent = text;
  }

  return e;

}


/* =========================================================
   NAVIGATION
========================================================= */

var TABS = [
  ["home", "Home"],
  ["services", "Services"],
  ["parts", "Spares"],
  ["enquiry", "Service request"],
  ["track", "Track request"],
  ["team", "Engineering desk"]
];


TABS.forEach(function (tab) {

  var button = el(
    "button",
    "",
    tab[1]
  );

  button.dataset.k = tab[0];

 button.onclick = function () {
    // Close the company and images panel
    var panel = $("companyPanel");
    if (panel) {
        panel.remove();
    }

    // Navigate to the selected section
    location.hash = tab[0];
};

  $("nav").appendChild(button);

});


function show() {

  var key = location.hash.slice(1);


  if (
    !TABS.some(function (tab) {
      return tab[0] === key;
    })
  ) {
    key = "home";
  }


  document
    .querySelectorAll("section")
    .forEach(function (section) {

      section.classList.toggle(
        "on",
        section.id === key
      );

    });


  document
    .querySelectorAll("nav button")
    .forEach(function (button) {

      button.classList.toggle(
        "on",
        button.dataset.k === key
      );

    });


  if (key === "team") {
    dash();
  }


  window.scrollTo(0, 0);

}


window.onhashchange = show;


/* =========================================================
   BRANDS
========================================================= */

BR.forEach(function (brand) {

  $("brands").appendChild(
    el("span", "chip", brand)
  );

});


/* =========================================================
   INDUSTRIES
========================================================= */

function loadIndustries(id) {

  var container = $(id);

  if (!container) {
    return;
  }

  container.textContent = "";

  IN.forEach(function (industry) {

    var chip = el("button", "chip", industry);

    chip.type = "button";

    chip.onclick = function () {
      openIndustryPanel(industry);
    };

    container.appendChild(chip);

  });

}
function openIndustryPanel(industry) {

  var info = INDUSTRY_INFO[industry];

  if (!info) {
    return;
  }

  var old = $("industryPanel");

  if (old) {
    old.remove();
  }

  var panel = el("div", "industry-panel");
  panel.id = "industryPanel";

  var box = el("div", "industry-box");

  var close = el(
    "button",
    "industry-close",
    "×"
  );

  close.onclick = function () {
    panel.remove();
  };

  box.appendChild(close);

  box.appendChild(
    el("h2", "", info.title)
  );

  box.appendChild(
    el("p", "industry-description", info.description)
  );

  box.appendChild(
    el("h3", "", "Applications")
  );

  var list = el("ul", "industry-applications");

  info.applications.forEach(function (item) {

    list.appendChild(
      el("li", "", item)
    );

  });

  box.appendChild(list);

  panel.appendChild(box);

  document.body.appendChild(panel);

}


loadIndustries("homeIndustries");
loadIndustries("inds");


/* =========================================================
   CARD GENERATOR
========================================================= */

/*function cards(id, array) {

  var container = $(id);

  if (!container) {
    return;
  }

  container.textContent = "";


  array.forEach(function (item, index) {

    var card = el("div", "card");


    card.appendChild(
      el(
        "div",
        "num",
        String(index + 1).padStart(2, "0")
      )
    );


    card.appendChild(
      el("h3", "", item[0])
    );


    card.appendChild(
      el("p", "", item[1])
    );


    container.appendChild(card);

  });

}*/
function cards(id, array) {

  var container = $(id);

  if (!container) return;

  container.textContent = "";

  array.forEach(function (s, i) {

    var c = el("div", "card service-card");

    c.append(
      el(
        "div",
        "num",
        String(i + 1).padStart(2, "0")
      ),

      el(
        "h3",
        "",
        s[0]
      ),

      el(
        "p",
        "",
        s[1]
      )
    );

    if (
  s[2] === "vfd" ||
  s[2] === "servo" ||
  s[2] === "plc" ||
  s[2] === "spares" ||
  s[2] === "rt1" ||
  s[2] === "rt2" ||
  s[2] === "rt3" ||
  s[2] === "rt4" ||
  s[2] === "rt5" ||
  s[2] === "rt6"
) {

      c.classList.add("clickable-service");

      var button = el(
        "button",
        "service-view-btn",
        "View companies & images"
      );

      button.onclick = function () {
        openCompanyPanel(s[2]);
      };

      c.appendChild(button);

      // Also allow clicking anywhere on the card
      c.onclick = function (event) {

        if (event.target.tagName !== "BUTTON") {
          openCompanyPanel(s[2]);
        }

      };
    }

    container.appendChild(c);
  });
}


function openCompanyPanel(type) {

  var companies;
  var title;

  if (type === "vfd") {

    companies = VFD_COMPANIES;
    title = "VFD AND AC DRIVE REPAIR";

  } else if (type === "servo") {

    companies = SERVO_COMPANIES;
    title = "SERVO DRIVE AND MOTOR REPAIR";

  } else if (type === "plc") {

    companies = PLC_COMPANIES;
    title = "PLC AND HMI REPAIR";

  }
  else if (type=="spares"){
    companies=SPARES_COMPANIES;
    title="SPARES SUPPLY";
  }
    else if (type === "rt1") {
    companies = RT_COMPANIES.rt1;
    title = "INJECTION MOULDING: NON-SERVO TO SERVO CONVERSION";
  }
  else if (type === "rt2") {
    companies = RT_COMPANIES.rt2;
    title = "INJECTION MOULDING: PLC CONVERSION";
  }
  else if (type === "rt3") {
    companies = RT_COMPANIES.rt3;
    title = "INJECTION MOULDING: ROBOTIC ARM CONVERSION";
  }
  else if (type === "rt4") {
    companies = RT_COMPANIES.rt4;
    title = "VFD / AC DRIVE RETROFIT";
  }
  else if (type === "rt5") {
    companies = RT_COMPANIES.rt5;
    title = "SERVO DRIVE AND MOTOR CONVERSION";
  }
  else if (type === "rt6") {
    companies = RT_COMPANIES.rt6;
    title = "PLC AND HMI RETROFIT";
  }
  /*var SPARES_COMPANIES = [
  ["Industrial Fans", "Cooling"],
  ["DC Fans", "Cooling"],
  ["AC Fans", "Cooling"],
  ["Resolvers", "Sensing"],
  ["Cables", "Cables"]
];*/

  var old = $("companyPanel");

  if (old) old.remove();

  var panel = el("div", "company-panel");
  panel.id = "companyPanel";

  var header = el("div", "company-panel-head");

  header.appendChild(
    el("h2", "", title)
  );

  var close = el("button", "company-close", "×");

  close.onclick = function () {
    panel.remove();
  };

  header.appendChild(close);

  panel.appendChild(header);

  panel.appendChild(
    el(
      "p",
      "",
      "Supported manufacturers and equipment handled by our technical team."
    )
  );

  var grid = el("div", "company-grid");

  companies.forEach(function (company) {

    var card = el("div", "company-card");

    var img = document.createElement("img");

    img.src = company[1];
    img.alt = company[0];
    img.loading = "lazy";

    img.onerror = function () {
      this.style.display = "none";
    };

    card.appendChild(img);

    card.appendChild(
      el("h3", "", company[0])
    );

    grid.appendChild(card);
  });

  panel.appendChild(grid);

  document.body.appendChild(panel);

  panel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* HOME */

cards(
  "svc0",
  SV.slice(0, 4)
);


/* SERVICES */

cards(
  "svc",
  SV
);


/* RETROFIT */

cards(
  "retro",
  RT
);


/* REPAIR */

cards(
  "rep",
  RP
);


/* =========================================================
   PART CATEGORY FILTER
========================================================= */

var cat = "All";


var categories = [
  "All",
  "Power",
  "Cooling",
  "Sensing",
  "Cables",
  "Control",
  "Mechanical"
];


categories.forEach(function (category) {

  var button = el(
    "span",
    "chip" + (
      category === "All" ? " on" : ""
    ),
    category
  );


  button.onclick = function () {

    cat = category;


    document
      .querySelectorAll("#cats .chip")
      .forEach(function (chip) {

        chip.classList.toggle(
          "on",
          chip === button
        );

      });


    plist();

  };


  $("cats").appendChild(button);

});


$("q").oninput = plist;


/* =========================================================
   PARTS LIST
========================================================= */

function plist() {

  var query = $("q").value
    .toLowerCase()
    .trim();

  var list = $("plist");

  list.textContent = "";


  var filtered = P.filter(function (part) {

    var categoryMatch =
      cat === "All" ||
      part[1] === cat;


    var searchText =
      (
        part[0] +
        " " +
        part[1] +
        " " +
        part[2]
      ).toLowerCase();


    return (
      categoryMatch &&
      searchText.indexOf(query) > -1
    );

  });


  if (!filtered.length) {

    list.appendChild(
      el(
        "div",
        "msg",
        "No matching components found."
      )
    );

    return;
  }


  filtered.forEach(function (part) {

    var card = el("div", "card");


    card.appendChild(
      el("div", "tag", part[1])
    );


    card.appendChild(
      el("h3", "", part[0])
    );


    card.appendChild(
      el(
        "p",
        "",
        part[2] + ". Pricing available on quotation."
      )
    );


    var button = el(
      "button",
      "btn o",
      "Request quotation"
    );


    button.onclick = function () {

      $("t").value = "Spares supply";

      $("m").value = part[0];

      location.hash = "enquiry";

    };


    card.appendChild(button);

    list.appendChild(card);

  });

}


plist();


/* =========================================================
   DATABASE
========================================================= */

var db = window.dbShim || null;


/* =========================================================
   PHONE NORMALIZATION
========================================================= */

function digits(value) {

  return String(value)
    .replace(/\D/g, "")
    .slice(-10);

}


/* =========================================================
   REFERENCE NUMBER
========================================================= */

function makeReference() {

  var date = new Date();

  var year =
    String(date.getFullYear()).slice(-2);

  var month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  var day =
    String(date.getDate())
      .padStart(2, "0");

  var random =
    Math.floor(
      1000 + Math.random() * 9000
    );


  return (
    "UAAS-" +
    year +
    month +
    day +
    "-" +
    random
  );

}


/* =========================================================
   EMAIL / WHATSAPP BODY
========================================================= */

function requestBody(v) {

  return (
    "Service request " + v.ref + "\n\n" +

    "Type: " + v.type + "\n" +

    "Name: " + v.name + "\n" +

    "Organisation: " + v.company + "\n" +

    "Contact: " + v.phone + "\n" +

    "Email: " + v.email + "\n" +

    "Manufacturer: " + v.brand + "\n" +

    "Model / Part: " + v.model + "\n\n" +

    "Details:\n" +

    v.details
  );

}


/* =========================================================
   SUBMIT ENQUIRY
========================================================= */

$("send").onclick = function () {

  var button = $("send");

  var v = {
    name: $("n").value.trim(),
    company: $("c").value.trim(),
    phone: $("p").value.trim(),
    email: $("e").value.trim(),
    type: $("t").value,
    brand: $("b").value.trim(),
    model: $("m").value.trim(),
    details: $("d").value.trim()
  };

  if (!v.name) {
    $("err").textContent = "Please provide your name.";
    return;
  }

  if (digits(v.phone).length < 10) {
    $("err").textContent = "Please provide a valid 10-digit contact number.";
    return;
  }

  $("err").textContent = "";
  button.disabled = true;
  button.textContent = "Submitting...";

  fetch(UAAS_API_BASE + "/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(v)
  })
    .then(async function (response) {
      var data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Enquiry submission failed.");
      }

      if (!data.reference) {
        throw new Error("The API did not return an enquiry reference.");
      }

      // Use the reference generated by the C# backend, not a browser-generated one.
      v.ref = data.reference;
      v.status = "Received";
      v.result = "";
      var body = requestBody(v);

      button.disabled = false;
      button.textContent = "Submit service request";
      $("fm").hidden = true;

      var done = $("done");
      done.hidden = false;
      done.textContent = "";
      done.appendChild(el(
        "div",
        "msg",
        "Your request has been recorded. Reference number: " +
          v.ref + ". Please retain this number."
      ));

      var emailButton = el("a", "btn", "Send by email");
      emailButton.href = "mailto:" + EM +
        "?subject=" + encodeURIComponent("Service request " + v.ref) +
        "&body=" + encodeURIComponent(body);
      done.appendChild(emailButton);

      var whatsappButton = el("a", "btn o", "Send on WhatsApp");
      whatsappButton.href = "https://wa.me/" + PH +
        "?text=" + encodeURIComponent(body);
      whatsappButton.target = "_blank";
      whatsappButton.rel = "noopener noreferrer";
      done.appendChild(whatsappButton);

      var newButton = el("button", "btn o", "New request");
      newButton.onclick = function () {
        $("done").hidden = true;
        $("fm").hidden = false;
        ["n", "c", "p", "e", "t", "b", "m", "d"].forEach(function (id) {
  var field = $(id);
  if (field) field.value = "";
});
$("err").textContent = "";
      };
      done.appendChild(newButton);
    })
    .catch(function (error) {
      console.error("C# enquiry submission error:", error);
      button.disabled = false;
      button.textContent = "Submit service request";
      $("err").textContent =
        "Your request could not be saved. Please check your connection and try again.";
    });

};


/* =========================================================
   TRACKING TIMELINE
========================================================= */

function tline(status) {

  var wrapper = el(
    "div",
    "tl"
  );


  var currentIndex =
    ST.indexOf(status);


  ST.forEach(function (step, index) {

    wrapper.appendChild(
      el(
        "div",
        index <= currentIndex ? "d" : "",
        step
      )
    );

  });


  return wrapper;

}


/* =========================================================
   REQUEST TRACKING
========================================================= */

$("go").onclick = function () {

  var result = $("tres");
  result.textContent = "";

  var reference = $("tr").value.trim();
  var phone = digits($("tp").value);

  if (!reference || phone.length < 10) {
    result.appendChild(el(
      "div",
      "msg",
      "Please enter a valid reference number and contact number."
    ));
    return;
  }

  result.appendChild(el("div", "msg", "Checking your request..."));

  fetch(UAAS_API_BASE + "/api/enquiries/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference: reference, phone: phone })
  })
    .then(async function (response) {
      var data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Tracking request failed.");
      }

      result.textContent = "";

      if (!Array.isArray(data) || data.length === 0) {
        result.appendChild(el(
          "div",
          "msg",
          "No matching request was found. Please verify your reference number and contact number."
        ));
        return;
      }

      var d = data[0];
      result.appendChild(el(
        "h3",
        "",
        d.ref + " | Service request"
      ));
      result.appendChild(tline(d.status));
      result.appendChild(el(
        "div",
        "msg",
        "Result: " + (d.result || "The outcome will be published here once available.")
      ));

      if (d.created_at) {
        var date = new Date(d.created_at);
        if (!Number.isNaN(date.getTime())) {
          result.appendChild(el(
            "p",
            "note",
            "Received: " + date.toLocaleString()
          ));
        }
      }
    })
    .catch(function (error) {
      console.error("C# tracking error:", error);
      result.textContent = "";
      result.appendChild(el(
        "div",
        "msg",
        "Tracking is currently unavailable. Please contact us."
      ));
    });

};


/* =========================================================
   ENGINEERING DASHBOARD
========================================================= */

var unsubscribe = null;

var flt = "All";
var activeTeamView = "requests";

var uaasStaffAccessUserId = null;
var uaasStaffAccessState = "unknown";
var uaasStaffAccessCheckPending = false;

/*
 * Engineering Desk inactivity timeout.
 * Staff are signed out after 30 minutes without interaction.
 */
var UAAS_STAFF_IDLE_TIMEOUT_MS = 10 * 60 * 1000;
var uaasStaffIdleTimer = null;
var uaasStaffLastActivityAt = 0;
var uaasStaffActivityStorageKey = null;
var uaasStaffAuthSubscription = null;
var uaasStaffAuthInitialized = false;
var uaasStaffLogoutInProgress = false;
var uaasStaffLogoutNotice = "";

function uaasGetStaffActivityStorageKey(session) {
  var userId = session && session.user && session.user.id;
  return userId ? "uaas-staff-last-activity:" + userId : null;
}

function uaasReadStaffLastActivity(key) {
  if (!key) return 0;
  try {
    var value = Number(localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch (_) {
    return 0;
  }
}

function uaasWriteStaffLastActivity(key, value) {
  if (!key) return;
  try {
    localStorage.setItem(key, String(value));
  } catch (_) {
    // The timeout still works in this tab if browser storage is unavailable.
  }
}

function uaasRemoveStaffLastActivity(key) {
  if (!key) return;
  try {
    localStorage.removeItem(key);
  } catch (_) {
    // Ignore storage cleanup errors.
  }
}

function uaasStopStaffIdleTimer() {
  if (uaasStaffIdleTimer) {
    clearTimeout(uaasStaffIdleTimer);
    uaasStaffIdleTimer = null;
  }
  uaasStaffLastActivityAt = 0;
}

function uaasScheduleStaffIdleCheck() {
  if (uaasStaffIdleTimer) {
    clearTimeout(uaasStaffIdleTimer);
    uaasStaffIdleTimer = null;
  }

  if (!window.sbUser || !window.sbUser.access_token || !uaasStaffLastActivityAt) {
    return;
  }

  var elapsed = Date.now() - uaasStaffLastActivityAt;
  var remaining = UAAS_STAFF_IDLE_TIMEOUT_MS - elapsed;

  if (remaining <= 0) {
    uaasStaffIdleTimer = setTimeout(uaasSignOutStaffForInactivity, 0);
    return;
  }

  uaasStaffIdleTimer = setTimeout(
    uaasSignOutStaffForInactivity,
    remaining
  );
}

function uaasStartStaffIdleTimer(session, freshSignIn) {
  if (session) {
    window.sbUser = session;
  }

  if (!window.sbUser || !window.sbUser.access_token) {
    uaasStopStaffIdleTimer();
    return;
  }

  var newStorageKey = uaasGetStaffActivityStorageKey(window.sbUser);

  if (newStorageKey !== uaasStaffActivityStorageKey) {
    uaasStopStaffIdleTimer();
    uaasStaffActivityStorageKey = newStorageKey;
  }

  var now = Date.now();
  var storedActivity = freshSignIn
    ? 0
    : uaasReadStaffLastActivity(uaasStaffActivityStorageKey);

  uaasStaffLastActivityAt = storedActivity || now;

  if (freshSignIn || !storedActivity) {
    uaasWriteStaffLastActivity(uaasStaffActivityStorageKey, now);
    uaasStaffLastActivityAt = now;
  }

  uaasScheduleStaffIdleCheck();
}

function uaasRecordStaffActivity() {
  if (!window.sbUser || !window.sbUser.access_token) {
    return;
  }

  // Check the elapsed time before extending the session.
  if (
    uaasStaffLastActivityAt &&
    Date.now() - uaasStaffLastActivityAt >= UAAS_STAFF_IDLE_TIMEOUT_MS
  ) {
    uaasSignOutStaffForInactivity();
    return;
  }

  uaasStaffLastActivityAt = Date.now();
  uaasWriteStaffLastActivity(
    uaasStaffActivityStorageKey,
    uaasStaffLastActivityAt
  );
  uaasScheduleStaffIdleCheck();
}

function uaasSignOutStaffForInactivity() {
  if (
    uaasStaffLogoutInProgress ||
    !window.sb ||
    !window.sb.auth ||
    !window.sbUser
  ) {
    return;
  }

  uaasStaffLogoutInProgress = true;
  var previousStorageKey = uaasStaffActivityStorageKey;

  uaasStaffLogoutNotice =
    "You have been signed out after 30 minutes of inactivity. Please sign in again.";

  window.sbUser = null;
  uaasRemoveStaffLastActivity(previousStorageKey);
  uaasStaffActivityStorageKey = null;
  uaasStopStaffIdleTimer();

  // Local scope clears this browser's session without signing staff out on
  // their other devices.
  Promise.resolve(
    window.sb.auth.signOut({ scope: "local" })
  )
    .catch(function (error) {
      console.error("Engineering Desk automatic sign-out failed:", error);
    })
    .then(function () {
      uaasStaffLogoutInProgress = false;

      if (location.hash.slice(1) === "team") {
        dash();
      }
    });
}

function uaasInitializeStaffSessionHandling() {
  if (
    uaasStaffAuthInitialized ||
    !window.sb ||
    !window.sb.auth ||
    typeof window.sb.auth.onAuthStateChange !== "function"
  ) {
    return;
  }

  uaasStaffAuthInitialized = true;

  var authResult = window.sb.auth.onAuthStateChange(function (event, session) {
    if (session && session.access_token) {
      window.sbUser = session;

      if (event === "SIGNED_IN") {
        uaasStaffLogoutNotice = "";
        uaasStartStaffIdleTimer(session, true);
      } else if (event === "INITIAL_SESSION") {
        uaasStartStaffIdleTimer(session, false);
      }
      // Token refreshes must not count as user activity.
      return;
    }

    if (event === "SIGNED_OUT") {
      var oldStorageKey = uaasStaffActivityStorageKey;
      window.sbUser = null;
      uaasRemoveStaffLastActivity(oldStorageKey);
      uaasStaffActivityStorageKey = null;
      uaasStopStaffIdleTimer();

      if (!uaasStaffLogoutInProgress && location.hash.slice(1) === "team") {
        uaasStaffLogoutNotice =
          "Your Engineering Desk session has ended. Please sign in again.";
        setTimeout(function () {
          if (location.hash.slice(1) === "team") dash();
        }, 0);
      }
    }
  });

  if (authResult && authResult.data) {
    uaasStaffAuthSubscription = authResult.data.subscription || null;
  }
}

// Any meaningful interaction resets the 30-minute inactivity countdown.
["pointerdown", "keydown", "click", "input", "touchstart", "scroll", "wheel"].forEach(
  function (eventName) {
    document.addEventListener(eventName, uaasRecordStaffActivity, { passive: true });
  }
);

// Browser timers may be throttled in background tabs, so check elapsed time
// again when the employee returns to the page.
document.addEventListener("visibilitychange", function () {
  if (!document.hidden && window.sbUser && window.sbUser.access_token) {
    if (
      uaasStaffLastActivityAt &&
      Date.now() - uaasStaffLastActivityAt >= UAAS_STAFF_IDLE_TIMEOUT_MS
    ) {
      uaasSignOutStaffForInactivity();
    } else {
      uaasScheduleStaffIdleCheck();
    }
  }
});

// Keep other open tabs in sync with the same staff account's last activity.
window.addEventListener("storage", function (event) {
  if (
    event.key &&
    event.key === uaasStaffActivityStorageKey &&
    event.newValue &&
    window.sbUser
  ) {
    var sharedActivity = Number(event.newValue);
    if (Number.isFinite(sharedActivity) && sharedActivity > uaasStaffLastActivityAt) {
      uaasStaffLastActivityAt = sharedActivity;
      uaasScheduleStaffIdleCheck();
    }
  }
});


function dash() {

  var D = $("dash");

  D.textContent = "";


  if (unsubscribe) {

    unsubscribe();

    unsubscribe = null;

  }



  if (!db || !window.sb) {

    D.appendChild(
      el(
        "p",
        "",
        "Authorised team access is required to view service requests."
      )
    );
  
    return;
  }

  


  /*
   * Check login session
   */

  if (!window.sbUser) {

    

    var form = el(
      "div",
      "form"
    );


    var email = document.createElement(
      "input"
    );

    email.type = "email";
    email.placeholder = "Email";


    var password = document.createElement(
      "input"
    );

    password.type = "password";
    password.placeholder = "Password";


    var loginButton = el(
      "button",
      "btn",
      "Sign in"
    );


    var error = el(
      "div",
      "note"
    );


    loginButton.onclick = function () {

      error.textContent = "";

      loginButton.disabled = true;

      loginButton.textContent =
        "Signing in...";


      window.sb.auth
        .signInWithPassword({
          email: email.value.trim(),
          password: password.value
        })

        .then(function (response) {

          loginButton.disabled = false;

          loginButton.textContent =
            "Sign in";


          if (response.error) {

            error.textContent =
              "Sign-in failed. Check your email and password.";

            return;

          }
    


          window.sbUser =
            response.data.session;

          uaasStaffLogoutNotice = "";
          uaasStartStaffIdleTimer(window.sbUser, true);

          dash();

        })

        .catch(function () {

          loginButton.disabled = false;

          loginButton.textContent =
            "Sign in";

          error.textContent =
            "Unable to sign in.";

        });
      

    };


    if (uaasStaffLogoutNotice) {
      error.textContent = uaasStaffLogoutNotice;
      uaasStaffLogoutNotice = "";
    }

    form.append(
      email,
      password,
      loginButton,
      error
    );

    D.appendChild(form);

    return;

  }


  /*
   * Status filters
   */
    // Engineering Desk views: Service Requests and Log Book
  var viewTabs = el("div", "chips");

  var requestsTab = el(
    "span",
    "chip" + (activeTeamView === "requests" ? " on" : ""),
    "Service Requests"
  );
  requestsTab.style.cursor = "pointer";
  requestsTab.onclick = function () {
    activeTeamView = "requests";
    dash();
  };

  var logbookTab = el(
    "span",
    "chip" + (activeTeamView === "logbook" ? " on" : ""),
    "Log Book"
  );
  logbookTab.style.cursor = "pointer";
  logbookTab.onclick = function () {
    activeTeamView = "logbook";
    dash();
  };

  viewTabs.append(requestsTab, logbookTab);
  D.appendChild(viewTabs);

  // Render the Log Book in the existing Engineering Desk
  if (activeTeamView === "logbook") {
    var logbookContainer = el("div", "logbook-content");
    D.appendChild(logbookContainer);

    if (typeof window.renderUAASLogbook !== "function") {
      logbookContainer.textContent =
        "Log Book module did not load. Check js/logbook.js in index.html.";
      return;
    }

    window.renderUAASLogbook(logbookContainer);
    return;
  }

  var top = el(
    "div",
    "chips"
  );
 



  ["All"]
    .concat(ST)
    .forEach(function (status) {

      var chip = el(
        "span",
        "chip" +
        (
          status === flt
            ? " on"
            : ""
        ),
        status
      );


      chip.onclick = function () {

        flt = status;

        dash();

      };


      top.appendChild(chip);

    });


  var list = el(
    "div",
    "grid"
  );


  D.append(
    top,
    list
  );


  unsubscribe =
    db
      .collection("enquiries")
      .orderBy(
        "created_at",
        "desc"
      )
      .limit(100)

      .onSnapshot(

        function (snapshot) {

          list.textContent = "";

          var count = 0;


          snapshot.docs.forEach(
            function (doc) {

              var v = doc.data();


              if (
                flt !== "All" &&
                v.status !== flt
              ) {
                return;
              }


              count++;


              var card = el(
                "div",
                "card"
              );


              card.appendChild(
                el(
                  "div",
                  "tag",
                  v.ref || "Request"
                )
              );


              card.appendChild(
                el(
                  "h3",
                  "",
                  v.name +
                  (
                    v.company
                      ? " | " + v.company
                      : ""
                  )
                )
              );


              card.appendChild(
                el(
                  "p",
                  "",
                  (
                    v.type || ""
                  ) +
                  " | " +
                  [
                    v.brand,
                    v.model
                  ]
                    .filter(Boolean)
                    .join(" ")
                )
              );


              card.appendChild(
                el(
                  "p",
                  "",
                  v.details ||
                  "No details provided."
                )
              );


              /*
               * Call customer
               */

              var call = el(
                "a",
                "btn o",
                "Call " + v.phone
              );

              call.href =
                "tel:" + v.phone;


              card.appendChild(call);


              /*
               * Status
               */

              var select =
                document.createElement(
                  "select"
                );


              ST.forEach(
                function (status) {

                  var option =
                    el(
                      "option",
                      "",
                      status
                    );

                  option.value = status;

                  option.selected =
                    status === v.status;

                  select.appendChild(
                    option
                  );

                }
              );


              /*
               * Result
               */

              var result =
                document.createElement(
                  "textarea"
                );

              result.rows = 3;

              result.placeholder =
                "Result/update visible to customer";

              result.value =
                v.result || "";


              /*
               * Update button
               */

              var update =
                el(
                  "button",
                  "btn",
                  "Update"
                );


              update.onclick = function () {

                update.disabled = true;

                update.textContent =
                  "Updating...";


                db
                  .doc(
                    "enquiries/" + doc.id
                  )
                  .update({
                    status:
                      select.value,

                    result:
                      result.value
                  })

                  .then(function () {

                    update.disabled = false;

                    update.textContent =
                      "Updated";

                  })

                  .catch(function (error) {

                    console.error(
                      "Update error:",
                      error
                    );

                    update.disabled = false;

                    update.textContent =
                      "Update failed";

                  });

              };


              card.append(
                select,
                result,
                update
              );


              list.appendChild(card);

            }
          );


          if (count === 0) {

            list.appendChild(
              el(
                "p",
                "",
                "No service requests found."
              )
            );

          }

        },


        function (error) {

          console.error(
            "Dashboard error:",
            error
          );


          D.appendChild(
            el(
              "p",
              "",
              "You do not have access to this section."
            )
          );

        }

      );


    }

/* =========================================================
   INITIAL PAGE
========================================================= */

uaasInitializeStaffSessionHandling();

show();
    