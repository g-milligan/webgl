//on page ready
jQuery(document).ready(function(s){
	//if there are any steps in the nav
	var stepsUl=jQuery('#hud .steps-wrap ul.steps:first');
	if(stepsUl.length>0){
		var stepElems=stepsUl.children('.step');
		if(stepElems.length>0){
			//set 100% to the ul
			stepsUl.css('width', '100%');
			//calculate the percentage that the steps should take up to fill the nav bar
			var calcPercent = 100 / stepElems.length;
			//set the width
			stepElems.css('width', calcPercent+'%');
		}
		//FUNCTION TO UPDATE THE PAGE SCROLL POSITION BAR
		var goToAnchor=function(target, moveScrollbar, animateScroll){
			if(animateScroll==undefined){animateScroll=true;}
			//FIND THE <a name=""> FOR THE GIVEN target
	  		//if starts with #
	  		if(target.indexOf('#')==0){
	  			//remove starting # hash
	  			target=target.substring(1);
	  		}
			//if there is a target value
	  		var targetElem=[];
	  		if(target!=undefined&&target.length>0){
	  			//get the anchor link <a> element for this #target
	  			targetElem = jQuery('.anchor[name=' + target +']');
	  		}
	  		//if there is an <a> element for this #target
	  		if (targetElem.length) {
	  			//GET THE TOP-LEVEL STEP NUMBER FROM target
	  			//get the step #
				var stepNum=-1;
				if(target.indexOf('step')==0){
					stepNum=target.replace('step','');
					//if there is more stuff after the number
					if(stepNum.indexOf('_')!=-1){
						//strip it off, get just the number
						stepNum=stepNum.substring(0, stepNum.indexOf('_'));
					}
					//convert to int
					stepNum=parseInt(stepNum);
				}
				//if there is a step number
				if(stepNum>0){
					//SHOW SLIDE PROGRESS ANIMATION TO THE TARGET STEP
					var animDelay=200;
					var backTrack=function(stopBeforeLi){
						//if stopBeforeLi still has progress
						if(stopBeforeLi.hasClass('progress')){
							//get the last li that has progress
							var nextBacktrack=stepsUl.children('li.progress:last');
							//remove progress from this li
							nextBacktrack.removeClass('done');
							nextBacktrack.removeClass('progress');
							nextBacktrack.addClass('back-track');
							setTimeout(function(){
								nextBacktrack.removeClass('back-track');
								//recursive backtrack for next li, if any
								backTrack(stopBeforeLi);
							},animDelay);
						}else{
							//the last progress li shows the arrow
							stopBeforeLi.prev('li:first').removeClass('done');
							stepsUl.removeClass('animation');
						}
					};
					var moveForeward=function(stopBeforeLi){
						//if NOT at the first element AND if NOT already progressed to before the stopBeforeLi element 
						var liBeforeEnd=stopBeforeLi.prev('li:first');
						if(liBeforeEnd.length>0&&!liBeforeEnd.hasClass('progress')){
							//get next li to progress to
							var nextProgress=stepsUl.children('li.progress:last');
							//if no li has progress yet
							if(nextProgress.length<1){
								//get first li
								nextProgress=stepsUl.children('li:first');
							}else{
								//make sure the element with last progress is done (hide arrow)
								nextProgress.addClass('done');
								//go to li AFTER the last li with progress
								nextProgress=nextProgress.next('li:first');
							}
							//if not reached the end of the li list
							if(nextProgress.length>0){
								//add progress to li
								nextProgress.addClass('progress');
								setTimeout(function(){
									//delay before progress animation is done
									nextProgress.addClass('done');
									//recursive progress for next li, if any
									moveForeward(stopBeforeLi);
								},animDelay);
							}
						}else{
							//the last progress li shows the arrow
							liBeforeEnd.removeClass('done');
							stepsUl.removeClass('animation');
						}
					};
					//starting step slider animation
					stepsUl.addClass('animation');
					//get some key step nav items
					var clickedStepElem=stepElems.filter(':eq('+(stepNum-1)+')');
					var lastProgressElem=stepElems.filter('.progress:last');
					//if not clicked first step
					if(stepNum>1){
						//get previous step li
						var prevStepElem=stepElems.filter(':eq('+(stepNum-2)+')');
						//if already has this progress class
						if(prevStepElem.hasClass('progress')){
							//move progress backward
							backTrack(clickedStepElem);
						}else{
							//doesn't already have the progress class...
							//move progress foreward
							moveForeward(clickedStepElem);
						}
					}else{
						//clicked the first step ...
						//if already has this progress class
						if(clickedStepElem.hasClass('progress')){
							//move progress backward
							backTrack(clickedStepElem);
						}else{
							stepsUl.removeClass('animation');
						}
					}
					//MOVE THE PAGE SCROLLBAR TO THE CORRECT STEP
					//if moving the scrollbar
					if(moveScrollbar){
						//if animating the scrollbar
						if(animateScroll){
							stepsUl.addClass('scrolling');
							//animate
							jQuery('html,body').animate({
			          			scrollTop: targetElem.offset().top
			        		}, 800, function(){
			        			stepsUl.removeClass('scrolling');
			        		});
			        	}else{
			        		//just move, don't animate scrollbar
			        		jQuery('html,body').scrollTop(targetElem.offset().top);
			        	}
		        	}
				}
	        }
		};
		//ADD PAGE ANCHOR CLICK EVENTS
		jQuery('a[href*=#]:not([href=#])').click(function(e) {
			//if scrolling animation is NOT already in progress
			if(!stepsUl.hasClass('scrolling')){
				//if nav bar animation is NOT already in progress
				if(!stepsUl.hasClass('animation')){
					//if the clicked link is a link to an internal page on this site (not external link)
					if (location.pathname.replace(/^\//,'') 
						== this.pathname.replace(/^\//,'') 
						&& location.hostname == this.hostname) {
						
						//get the link hash that was clicked
						var target = this.hash;
						goToAnchor(target,true); //true = move the page scrollbar
							
						e.preventDefault();
					}
				}
			}
		});
	}
});
