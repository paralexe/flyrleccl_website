/* ==========================================================================
   STEP 1: Executed IMMEDIATELY when the script loads in the <head> (before the <body> loads)
   ========================================================================== */

// 1. Creating the dataLayer array and the global gtag() function on the window object.
window.dataLayer = window.dataLayer || [];
function gtag(){ window.dataLayer.push(arguments); }

// 2. Setting up basic GA4 configuration parameters
gtag('js', new Date());
gtag('config', 'G-MENVLXFQ27');

// 3. Dynamically create a <script> tag to load the external gtag.js library.
const gtagScript = document.createElement('script');
gtagScript.async = true;
gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-MENVLXFQ27';

// Insertion the created <script> tag into <head>
document.head.appendChild(gtagScript);

/* ==========================================================================
   STEP 2: A script that launches a background event listener once the DOM has finished loading
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
	// 1. function to generate eventName from elementName & actionType and call GA4 function gtag()
	function callGtag(elementGroup, actionType, extraParams = {}) {
		const eventName = `${elementGroup}_${actionType}`;
		
		gtag('event', eventName, {
		  'element_group': elementGroup,
		  'interaction_type': actionType,
		  ...extraParams
		});
	}

	// 2. Checks whether tracking is enabled for the given event.
	function validateTracking(event) {
		/* Checking whether the element (or its parent) associated with the current event has
		   data-atg attribute (this means that element is included in an analytic target group of elements).*/
		const target = event.target?.closest('[data-atg]');
		
		if (!target) { return null }
		
		return validateTarget(target, event.type);
	}
	
	function validateTarget(targetElement, eventType, extraParams = {}) {

		const ate = targetElement.getAttribute('data-ate');

		if (ate !== null && !(ate.trim().split(/\s+/).includes(eventType))) {
			return null;
		}	
		
		const atg = targetElement.getAttribute('data-atg');

		// Clone dataset and sanitize service parameters (atg, ate)
		const params = {
			...targetElement.dataset,
			...extraParams
		};
		delete params.atg;
		delete params.ate;

		return { targetElement, atg, params };
	}
	
	// 3. Creating a local list of elements for the copy event
	let copyTrackableElements = [];

	const candidates = document.querySelectorAll('[data-atg]');
	  
	copyTrackableElements = Array.from(candidates).filter(el => {
		const ate = el.getAttribute('data-ate');
		// Enable if `data-ate` explicitly contains 'copy' OR if `data-ate` is missing entirely (default).
		return ate === null || ate.trim().split(/\s+/).includes('copy');
	});

	// 4.1. LISTEN LOCAL EVENTS: for the each local event, run event listeners over document (body)  
	['click', 'contextmenu'].forEach(eventType => {
		document.body.addEventListener(eventType, (event) => {
			const res = validateTracking(event);
			if (!res) return;

			callGtag(res.atg, event.type, res.params);
		});
	});

	// 4.2. LISTEN MULTI-ELEMENTS EVENTS:
	// 4.2.1 Copy listener
	if (copyTrackableElements.length !== 0) {
		document.addEventListener('copy', () => {

			const selection = window.getSelection();
			if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

			const range = selection.getRangeAt(0);

			copyTrackableElements.forEach(element => {
				if (range.intersectsNode(element)) {
					const res = validateTarget(element, 'copy', {
							copied_text: selection.toString().trim()
					});

					if (res) {
						callGtag(res.atg, 'copy', res.params);
					}
				}
			});
		});	
	}
	
	// 5. TRACKING SECTION VIEWS AND TIME SPENT

	// Map for storing section entry time (node -> timestamp)
	const viewStartTimes = new WeakMap();

	// Collection of all sections subject to view tracking
	const viewCandidates = document.querySelectorAll('[data-atg]');
	const viewTrackableElements = Array.from(viewCandidates).filter(el => {
		const ate = el.getAttribute('data-ate');
		return ate === null || ate.trim().split(/\s+/).includes('view');
	});

	if (viewTrackableElements.length !== 0) {
		const viewObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				const element = entry.target;

				if (entry.isIntersecting) {
					// The section has entered the screen — we are recording the exact moment in time.
					viewStartTimes.set(element, performance.now());
				} else {
					// The section emerged from the screen.
					const startTime = viewStartTimes.get(element);

					if (startTime) {
						// Calculate the viewing time in seconds (rounded to one decimal place).
						const durationSeconds = parseFloat(((performance.now() - startTime) / 1000).toFixed(1));
						viewStartTimes.delete(element); // Очищаем метку

						// Send the event only if the viewing time exceeds 1 second (protection against rapid scrolling).
						if (durationSeconds >= 1.0) {
							const res = validateTarget(element, 'view', {
								time_spent_seconds: durationSeconds
							});

							if (res) {
								callGtag(res.atg, 'view', res.params);
							}
						}
					}
				}
			});
		}, {
			threshold: 0.5 // A section is considered "viewable" when at least 50% of it is visible.
		});

		// Subscribe all discovered sections for monitoring.
		viewTrackableElements.forEach(el => viewObserver.observe(el));
	}
});