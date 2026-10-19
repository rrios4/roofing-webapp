// Static copy for the roofing proposal PDF. Kept as plain data (not JSX) so
// wording changes are a copy edit, not a layout edit. Adapted from the
// reference Rios Roofing Services proposal document.

export const COMPANY = {
  name: 'RIOS ROOFING',
  legalName: 'Rios Roofing Services',
  tagline: 'Professional Roofing Services',
  street: '150 Tallant St',
  cityStateZip: 'Houston, TX 77076',
  phone: '832-310-3593',
  email: 'rrios.roofing@gmail.com',
  website: 'www.riosroofingservices.com',
  ownerName: 'Rogelio Rios'
};

export const DEFAULT_SHINGLE = {
  brand: 'Tamko',
  model: 'Titan XT',
  color: 'TBD'
};

export const introParagraph =
  'This proposal outlines the right roofing option for your wonderful home and will answer any ' +
  'questions you may have about the process. We can assure you our specialized team will treat ' +
  'your home as if it was their own and bring newfound beauty, safety, and value.';

export const introBullets = [
  'The right materials and colors that will be the best fit for your current environment.',
  'The roof replacement takes from 2 - 5 days.',
  'Calculated lifespan and workmanship warranty included if our service fails to reach water protection expectations for the first 3 years.',
  'Calculated estimate, guaranteeing the best value for money.'
];

export const introClosing =
  'We understand that replacing and repairing your roof is a big investment that requires careful ' +
  'consideration. In a business as tough as construction, our start-to-finish process and detailed ' +
  'estimates are there to make your roof replacement project as easy as possible to understand.';

export const techniques = [
  {
    title: 'Storm-Resistant Shingle Installation',
    description:
      'We use six nails for each shingle to create a stronger hold, ensuring your roof can withstand even the toughest storms.'
  },
  {
    title: 'Watertight Roof Vents',
    description:
      'We apply peel-and-stick membranes to all roof vents, providing a watertight seal for maximum protection against water intrusion.'
  },
  {
    title: 'Guaranteed Chimney Flashing',
    description:
      'Our comprehensive package includes chimney flashing, expertly installed to prevent any water from seeping into your home.'
  },
  {
    title: 'Enhanced Valley Protection',
    description:
      'In areas where roof valleys are present, we use both peel-and-stick membranes and flashing to ensure these vulnerable spots have the utmost protection.'
  }
];

export const techniquesClosing =
  "By choosing Rios Roofing, you're investing in unmatched quality and peace of mind. Our signature " +
  'techniques ensure your roof not only meets but exceeds industry standards, providing you with ' +
  'long-lasting protection and reliability.';

// Static "Roofing System Materials" rows. The shingle row is dynamic and
// rendered separately from quote.shingle_brand / shingle_model / shingle_color.
export const materialsRows: Array<{ label: string; details: string }> = [
  {
    label: 'Peel & Stick Underlayment',
    details: 'Protection for vulnerable roof penetrations, valleys, chimneys, & skylights.'
  },
  {
    label: 'Synthetic Underlayment',
    details: "Breathable & Durable. Won't Rip & Tear Like Cheap Felt or Tar Paper."
  },
  {
    label: 'Starter Shingles',
    details: 'Required to prevent perimeter wind & water damage.'
  },
  {
    label: 'Hip and Ridge Shingles',
    details: 'Distinctive Ridge & Hip Shingles Protect High-Stress Areas of Roof.'
  },
  {
    label: 'Ridge Vents',
    details: 'The most efficient way to vent heat & moisture from attic.'
  },
  {
    label: 'Roof Tear off & Disposal',
    details:
      'Removal & Disposal of 1-Layer of old roof material down to Plywood Decking is included. Also included is up to 3 sheets of plywood to replace damaged plywood discovered. Additional damaged plywood sheets are $85 per sheet for labor and material.'
  },
  {
    label: '26-Gauge 2x2 Eave & Drip Edge Flashing',
    details: 'Protects the vulnerable edges of roof from wind, ice and rain.'
  },
  {
    label: '26-Gauge Valley Flashing (if applicable)',
    details: 'Protects vulnerable valleys, reinforced with ice & water shield underlayment.'
  },
  {
    label: 'Bath & Kitchen Roof Vents',
    details: 'Standard metal roof vents with integral dampers.'
  },
  {
    label: 'Plumbing Galvanized Steel Pipe Boots',
    details: 'Required protection for a long-lasting roof.'
  },
  {
    label: 'Chimney Flashing',
    details: 'Required for long-term protection & helping prevent future leaks.'
  },
  {
    label: 'Re-Flash Existing Skylights (if applicable)',
    details:
      'Included for free, new skylight flashing, ice & water shield for reliability (skylight replacement sold separately).'
  },
  {
    label: 'Roof Accessories',
    details: 'Roofing paint, caulking, 1 1/4" coil nails, and plastic round cap roofing nails.'
  },
  {
    label: 'Post Installation Jobsite Cleanup',
    details:
      'Cleanup all project debris, magnetic sweep for metal/nails & final jobsite walk-around w/homeowner.'
  }
];

export const downPaymentNote =
  'A 50% down payment of the total estimate is required to finalize plans and to begin the procurement of materials.';

export const projectDetailsSteps: Array<{ title: string; bullets: string[] }> = [
  {
    title: 'Site Preparation',
    bullets: [
      'Conduct a thorough inspection of the existing roof to assess its current condition and identify any specific issues that need to be addressed.',
      'Evaluate the structural integrity of the roof deck and note any areas requiring special attention.',
      'Prepare the surrounding area by safeguarding landscaping and setting up necessary safety measures to protect your property during the roofing project.'
    ]
  },
  {
    title: 'Removal of Existing Roofing Material',
    bullets: [
      'Carefully remove all existing shingles, underlayment, and any old roofing materials.',
      'Inspect the roof deck for any damage or rot and prepare the surface for new installation.'
    ]
  },
  {
    title: 'Replacement of Damaged Plywood Decking',
    bullets: [
      'Replace up to 3 sheets of damaged plywood decking as needed. Any additional sheets required will be replaced at a rate of $85 per sheet, which includes material and labor costs.'
    ]
  },
  {
    title: 'Installation of Synthetic Roofing Underlayment',
    bullets: [
      'Install a high-quality synthetic roofing underlayment to provide an additional layer of protection against moisture and weather.'
    ]
  },
  {
    title: 'Installation of Water/Ice Protective Membrane',
    bullets: [
      'Apply a water/ice protective membrane along eaves and other vulnerable areas to prevent ice dams and water infiltration.'
    ]
  },
  {
    title: 'Installation of New Asphalt Shingles',
    bullets: [
      "Install new 30-year rated asphalt shingles of the homeowner's choice, ensuring compliance with the manufacturer's specifications.",
      'Use six nails per shingle to ensure a secure hold and increased resistance to storms and high winds.',
      'The installation of new shingles will be done by hand/gun to ensure quality nailing of shingles.'
    ]
  },
  {
    title: 'Installation of Roofing Components',
    bullets: [
      'Install approved ridge vents and ridge caps to ensure proper ventilation.',
      "Install new lead jacks, roof box vents, or pipe vent collars depending on the home's set up for ventilation.",
      'Install roof flashing around chimneys and valleys (depends on home if applicable).',
      '2x2 drip-edge (color compliments choice of shingle color) along all edges to prevent water damage to the fascia and soffit.'
    ]
  },
  {
    title: 'Final Inspection and Quality Assurance',
    bullets: [
      "Conduct a final inspection to ensure all work meets quality standards and the homeowner's expectations."
    ]
  },
  {
    title: 'Site Clean-Up and Waste Disposal',
    bullets: [
      'Thoroughly clean the project site, removing all debris and waste materials.',
      'Dispose of all project waste in compliance with local regulations and environmental guidelines.'
    ]
  },
  {
    title: 'Warranty and Report',
    bullets: [
      'Provide a 3-year workmanship warranty on the roof installation.',
      'Provide a report with before and after photos of the roof installation.'
    ]
  }
];

export const projectDetailsClosing =
  'By choosing our roofing service, you can expect a professional and hassle-free experience with a ' +
  'focus on quality, safety, and customer satisfaction. We look forward to transforming and ' +
  'protecting your home with our expert roof installation.';

export const planOfAction: Array<{ range: string; description: string }> = [
  {
    range: 'Day 1 - 2',
    description:
      'Our roofing experts will work on removing the old structure and securing the working area.'
  },
  {
    range: 'Day 2 - 3',
    description:
      'During the next couple of days, our crew will work on the installation of new roof systems and shingles.'
  },
  {
    range: 'Day 3 - 4',
    description:
      'Once the re-roofing is done, we will focus on finalizing the work, inspections, and cleanups.'
  }
];

export const planOfActionIntro =
  'After you sign our proposal, we will schedule a follow-up call to finalize the details and decide ' +
  'on the best starting date for the project. Usually, projects can take up to 6 days depending on ' +
  'the size of home or availability of crews. Below is an ideal timeline for a home that is 60+ sq ' +
  'to begin and finish the project.';

export const acceptanceIntro =
  'To approve this roofing proposal and proceed with scheduling, simply affix your signature below. ' +
  'By signing, the homeowner agrees to the terms of this agreement (review the terms and conditions ' +
  'section before signature) and agrees that a typed name can be used as a digital representation of ' +
  'their signature to that fact.';

export const waiverParagraphs: string[] = [
  'I HEREBY ASSUME ALL OF THE RISKS OF PARTICIPATING IN ANY/ALL ACTIVITIES ASSOCIATED WITH THIS ' +
    'EVENT, including by way of example and not limitation, any risks that may arise from negligence ' +
    'or carelessness on the part of the persons or entities being released from dangerous or ' +
    'defective equipment or property owned, maintained, or controlled by them, or because of their ' +
    'possible liability without fault.',
  'I certify that there are no health-related reasons or problems which preclude my participation in ' +
    'this activity. I acknowledge that this Accident Waiver and Release of Liability Form will be ' +
    'used by the event holders, sponsors, and organizers of the activity in which I may participate, ' +
    'and that it will govern my actions and responsibilities at said activity.',
  'In consideration of my application and permitting me to participate in this activity, I hereby act ' +
    'for myself, my executors, administrators, heirs, next of kin, successors, and assigns as follows:',
  '(A) I WAIVE, RELEASE, AND DISCHARGE from any and all liability, including but not limited to, ' +
    'liability arising from the negligence or fault of the entities or persons released, for my ' +
    'death, disability, personal injury, property damage, property theft, or actions of any kind ' +
    'which may hereafter occur to me including my traveling to and from this activity, THE FOLLOWING ' +
    'ENTITIES OR PERSONS: Homeowners of and/or their directors, officers, employees, volunteers, ' +
    'representatives, and agents, and the activity holders, sponsors, and volunteers;',
  '(B) INDEMNIFY, HOLD HARMLESS, AND PROMISE NOT TO SUE the entities or persons mentioned in this ' +
    'paragraph from all liabilities or claims made because of participation in this activity, ' +
    'whether caused by the negligence of release or otherwise.',
  'I acknowledge that Homeowners of and their directors, officers, volunteers, representatives, and ' +
    'agents are NOT responsible for the errors, omissions, acts, or failures to act of any party or ' +
    'entity conducting a specific activity on their behalf.',
  'I hereby consent to receive medical treatment which may be deemed advisable in the event of ' +
    'injury, accident, and/or illness during this activity.',
  'The Accident Waiver and Release of Liability Form shall be construed broadly to provide a release ' +
    'and waiver to the maximum extent permissible under applicable law.',
  'I CERTIFY THAT I HAVE READ THIS DOCUMENT AND I FULLY UNDERSTAND ITS CONTENT. I AM AWARE THAT THIS ' +
    'IS A RELEASE OF LIABILITY AND A CONTRACT AND I SIGN IT OF MY OWN FREE WILL.'
];

export const termsClauses: string[] = [
  'The client may cancel this contract within 3 days of the signature date without penalty. RIOS ' +
    'ROOFING SERVICES may cancel the contract prior to the commencement of work. If work has begun ' +
    'or materials have been ordered, the contract cannot be canceled. If the contract is canceled ' +
    'after 3 days from the signature date, there will be a 5% charge based on the contract total ' +
    'before tax.',
  'The client is entitled to a copy of this contract at the time of signature.',
  'Upon signing of this proposal, it becomes a binding contract and is the entire agreement between ' +
    'parties. All change orders shall be in writing and signed by both the client and RIOS ROOFING ' +
    'SERVICES.',
  'Unless specifically stated in writing as part of this proposal, RIOS ROOFING SERVICES does not ' +
    'obtain or provide roofing permits for re-roof or repair projects, and permit fees are not ' +
    'included in the contract price. The client acknowledges that certain roofing work may require ' +
    'permits, inspections, or approvals from local authorities and accepts full responsibility for ' +
    'obtaining any required permits unless otherwise agreed in writing. If the client elects to ' +
    'proceed without obtaining required permits, the client assumes all responsibility for any ' +
    'resulting delays, fines, penalties, inspections, corrections, or issues arising from municipal ' +
    'code enforcement. RIOS ROOFING SERVICES shall not be responsible for costs or delays resulting ' +
    "from the client's failure to obtain required permits, except where contractor compliance is " +
    'required by applicable law.',
  'Warning: Roofing operations are at times noisy and may cause unavoidable vibrations. The client ' +
    'should protect or remove any valuables which might be dislodged from walls, shelving, or ' +
    'ceilings and calm or relocate pets as needed during the roof installation.',
  'RIOS ROOFING SERVICES may, at its discretion, engage subcontractors to perform work hereunder, ' +
    'provided RIOS ROOFING SERVICES shall fully pay the subcontractor and in all instances remain ' +
    'responsible for the proper completion of this contract.',
  'The client shall supply water and electricity as needed and provide suitable access to the ' +
    'property. RIOS ROOFING SERVICES assumes no liability for cracks to driveways, sidewalks, or for ' +
    'damages to landscaping. RIOS ROOFING SERVICES will take precautions to minimize these potential ' +
    'problems.',
  'RIOS ROOFING SERVICES shall not be liable for any delay due to circumstances beyond its control, ' +
    'including strikes, casualty, or unavailability of materials and inclement weather. If roofers ' +
    'are unable to access the property at the pre-scheduled time, there will be an additional ' +
    'rescheduling fee of $50.00.',
  'RIOS ROOFING SERVICES will take reasonable care to disconnect any mechanical equipment that must ' +
    'be moved during the roofing work. RIOS ROOFING SERVICES is not liable for the failure of the ' +
    'equipment to operate properly after reinstallation, including but not limited to air ' +
    'conditioners, swamp coolers, ductwork, and stands, P.V.C. and water lines, solar units, ' +
    'skylights, pest control devices, satellite dishes, and realignment of same.',
  'Because ponding and standing of water are caused by factors such as inadequate drainage, ' +
    'deflection, and insufficient slope which are beyond the control of RIOS ROOFING SERVICES, RIOS ' +
    'ROOFING SERVICES shall not be liable for ponding or standing of water on the roof. If the ' +
    'client should require an additional estimate to help resolve the problem, RIOS ROOFING ' +
    "SERVICES will furnish such an estimate at the client's request.",
  'The weight, thickness, color, and other qualities of materials are approximate and are subject to ' +
    'normal industry variation. This proposal is based on a complete job; surplus materials remain ' +
    'the property of RIOS ROOFING SERVICES and will be removed in a timely manner.',
  'Upon completion of the work, the client may inspect the work. If it is deemed unsatisfactory, the ' +
    'client may inform RIOS ROOFING SERVICES. Final payment or failure to inspect within 2 days ' +
    'constitutes acceptance.',
  'Payment is due upon completion of the job. If payment has not been made within 30 days of ' +
    'billing, a late penalty of 10% of the unpaid amount will apply. Finance charges of 1.5% will be ' +
    'assessed after 30 days and every 30 days thereafter. In such a case, RIOS ROOFING SERVICES may ' +
    'take action, possibly filing a lien, to enforce payment of the agreed price.',
  'RIOS ROOFING SERVICES also accepts VISA and MasterCard for payment. However, an additional 3% ' +
    'charge applies to such transactions.',
  'The warranty is solely for the benefit of the client. Please contact RIOS ROOFING SERVICES for ' +
    'options regarding transferability.',
  'RIOS ROOFING SERVICES warranty is limited to repairing and replacing the roofing material only. ' +
    'Excluded from this warranty are interior damages to the building or its contents including ' +
    'damages caused to the roof by others, or fire, etc. The replacement of broken tile does not ' +
    'warranty against leakage unless the underlayment is also replaced. The client agrees to ' +
    'maintain homeowners or property insurance and in the event of damages to or loss of property, ' +
    'agrees to make an appropriate claim with their insurance company. For more information ' +
    'regarding our workmanship warranty please refer to the document we send after project ' +
    'completion.',
  'RIOS ROOFING SERVICES shall not be held liable for drywall, plaster, or stucco cracking caused by ' +
    'a change or additional weight during or after roofing or repair. RIOS ROOFING SERVICES is not ' +
    'responsible for stucco leaks unless specifically addressed in this proposal.',
  'If any provision of this contract is deemed invalid or unenforceable, the enforceability of the ' +
    'remaining provisions will not be affected.',
  'To obtain the performance of any warranty obligation the contract must be paid in full; then the ' +
    'client must notify RIOS ROOFING SERVICES of any repairs required through certified mail, text ' +
    'message, or email. RIOS ROOFING SERVICES shall then have 90 days to make repairs. Replacement ' +
    'and/or repairs furnished under this warranty do not carry a new warranty, only the unexpired ' +
    'portion of the original warranty.',
  'RIOS ROOFING SERVICES reserves the right to file for supplemental claims due to material or labor ' +
    'price increases, missing materials or labor charges, or if insurance measurements are proven to ' +
    'be incorrect.',
  "RIOS ROOFING SERVICES is empowered to contact the homeowner's insurance carrier and meet with " +
    'their representative to negotiate the payment (as to the amount of damage to listed property), ' +
    'and to discuss the repair or replacement work to be done on the property. Upon insurance ' +
    'carriers and RIOS ROOFING SERVICES agreement to the extent of damages and the cost of fixing ' +
    'them, the work may begin on said property.',
  'The homeowner also agrees to provide all necessary documentation for the claim, also providing ' +
    'all pertinent documentation to facilitate payment from the insurance carrier and/or mortgage ' +
    'company.'
];
