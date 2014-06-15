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
		var animDelay=200;var scrollAnimDelay=800;
		var getStepNumFromTarget=function(target){
			var stepNum=target;
			if(typeof stepNum=='string'){
		  		//if starts with #
		  		if(stepNum.indexOf('#')==0){
		  			//remove starting # hash
		  			stepNum=stepNum.substring(1);
		  		}
		  		//if this target string contains 'step'
		  		if(stepNum.indexOf('step')==0){
		  			//remove 'step'
					stepNum=stepNum.replace('step','');
					//if there is more stuff after the number
					if(stepNum.indexOf('_')!=-1){
						//strip it off, get just the number
						stepNum=stepNum.substring(0, stepNum.indexOf('_'));
					}
					//convert to int
					stepNum=parseInt(stepNum);
				}
				//set to -1 if stepNum is still a string
				if(typeof stepNum=='string'){stepNum=-1;}
			}
			//return the step number
			return stepNum;
		};
		//function only used inside alignProgressBarWithScroll
		var setProgressBarStep=function(stepNum, progPercent){
			//make sure to get the step number integer, if a target string was passed as stepNum
			var stepNum=getStepNumFromTarget(stepNum);
			//if a valid step number was passed
			if(stepNum>0){
				//SHOW SLIDE PROGRESS ANIMATION (IN THE NAV) TO THE TARGET STEP
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
				//remove the current step class (only the current step gets this class)
				stepElems.removeClass('current');
				//get some key step nav items
				var clickedStepElem=stepElems.filter(':eq('+(stepNum-1)+')');
				var lastProgressElem=stepElems.filter('.progress:last');
				//add the current class
				clickedStepElem.addClass('current');
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
			}
		};
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
	  			targetElem = jQuery('.anchor[name=' + target +']:first');
	  		}
	  		//if there is an <a> element for this #target
	  		if (targetElem.length) {
				//MOVE THE PAGE SCROLLBAR TO THE CORRECT STEP
				//if moving the scrollbar
				if(moveScrollbar){
					//if animating the scrollbar
					if(animateScroll){
						stepsUl.addClass('scrolling');
						//animate
						jQuery('html,body#body').animate({
		          			scrollTop: targetElem.offset().top
		        		}, scrollAnimDelay, function(){
		        			stepsUl.removeClass('scrolling');
		        		});
		        	}else{
		        		//just move, don't animate scrollbar
		        		jQuery('html,body').scrollTop(targetElem.offset().top);
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
						//don't change the url
						e.preventDefault();
					}
				}
			}
		});
		//WINDOW READY
		jQuery(window).ready(function(){
			var hudWrap=jQuery('#hud:last');
			//WINDOW RESIZE
			//function for every window resize
			var windowResize=function(){
				//window height
				var viewHeight = window.outerHeight;
				//if there is a step wrap in the body
				var lastWrap=jQuery('#body > .step-wrap:last');
				if(lastWrap.length>0){
					//set the min height of last element so that the anchor scrolling can scroll to each item 
					lastWrap.css('min-height',viewHeight+'px');
				}
			};
			//on window resize
			jQuery(window).resize(function(){
				//resize function onresize
				windowResize();
			});
			//resize function onload
			windowResize();
			//WINDOW SCROLL
			//get the two anchors closest to the hud's bottom edge; one below and one above this edge
			var getPrevAndNextAnchors=function(){
				//get the offset bottom of the #hud
				var hudOffsetBottom = hudWrap.offset().top;
				hudOffsetBottom += hudWrap.outerHeight();
				//get the anchors
				var level1Anchs=jQuery('a[name].anchor.level1');
				//for each level1 anchor (find two close anchors above and below the hud's bottom edge)
				var nextAnchBelowHud;var prevAnchAboveHud;
				level1Anchs.each(function(){
					//get the bottom edge of this anchor's parent step-wrap
					var stepWrap=jQuery(this).parent();
					var stepWrapBottomOffset=stepWrap.offset().top;
					stepWrapBottomOffset+=stepWrap.outerHeight();
					//if the bottom of this step is above the bottom of the hud (passed)
					if(stepWrapBottomOffset<hudOffsetBottom){
						//set this as the prev anchor
						prevAnchAboveHud=jQuery(this);
					}else{
						//set this as the next anchor
						nextAnchBelowHud=jQuery(this);
						//end the jQuery loop
						return false;
					}
					
				});
				return {'prev':prevAnchAboveHud,'next':nextAnchBelowHud};
			};
			//calculate how much additional progress, beyond the start of the current step, has been made
			var getCurrentStepPercent=function(){
				//get the two anchors closest to the hud's bottom edge; one below and one above this edge
				var anchors=getPrevAndNextAnchors();
				//calculate how much additional progress, beyond the start of the current step, has been made
				var progPercent=0;
				//note, anchors.next is the current active step's anchor element
				if(anchors.next!=undefined){
					//get the step wrap offset and height
					var stepWrap=anchors.next.parent();
					var stepWrapHeight=stepWrap.outerHeight();
					var stepWrapOffsetTop=stepWrap.offset().top;
					//get the offset bottom of the #hud
					var hudOffsetBottom = hudWrap.offset().top + hudWrap.outerHeight();
					//if the bottom of the hud is after the top of the stepWrap
					if(hudOffsetBottom>stepWrapOffsetTop){
						//how many pixels did the hud overlap the stepWrap?
						var hudOverlap=hudOffsetBottom-stepWrapOffsetTop;
						//calculate % that the hud has scrolled over the stepWrap
						var progPercent = hudOverlap / stepWrapHeight;
						progPercent *= 100;
						//round to the nearest integer
						Math.floor(progPercent);
					}
				}
				return progPercent;
			};
			//check if the progress bar is aligned with the current scroll position
			var progressBarIsAligned=function(){
				var isAligned=true;
				//get the two anchors closest to the hud's bottom edge; one below and one above this edge
				var anchors=getPrevAndNextAnchors();
				//get the step numbers of the two anchors (if they exist)
				var prevStepNum
				if(anchors.prev!=undefined){prevStepNum=getStepNumFromTarget(anchors.prev.attr('name'));}
				var nextStepNum
				if(anchors.next!=undefined){nextStepNum=getStepNumFromTarget(anchors.next.attr('name'));}
				//get the prev and next items from the progress nav
				var prevNavItem;
				if(prevStepNum!=undefined){prevNavItem=stepElems.filter(':eq('+(prevStepNum-1)+')');}
				var nextNavItem;
				if(nextStepNum!=undefined){nextNavItem=stepElems.filter(':eq('+(nextStepNum-1)+')');}
				//if the next nav item has progress (it shouldn't)
				if(nextNavItem!=undefined&&nextNavItem.hasClass('progress')){
					isAligned=false;
				}
				//if so far aligned
				if(isAligned){
					//if the prev nav item DOESN't have progress (it should)
					if(prevNavItem!=undefined&&!prevNavItem.hasClass('progress')){
						isAligned=false;
					}else{
						//the top-level steps ARE aligned, now check percentage of current step...
						//if there is a nextNavItem
						if(nextNavItem!=undefined){
							//get the current percentage
							var progPercent = getCurrentStepPercent();
							//check to see if the progress bar already has this percentage
							var progBar=nextNavItem.find('.bar:last');
							var progBarPerc=parseInt(progBar.css('width'));
							//if the progress bar width differs from the percentage
							if(progPercent!=progBarPerc){
								isAligned=false;
							}
						}
					}
				}
				return isAligned;
			};
			var realign_timeout;
			var alignProgressBarWithScroll=function(){
				//if the progress bar is NOT already aligned
				if(!progressBarIsAligned()){
					//if scrolling animation is NOT already in progress
					if(!stepsUl.hasClass('scrolling')){
						//if nav bar animation is NOT already in progress
						if(!stepsUl.hasClass('animation')){
							//get the two anchors closest to the hud's bottom edge; one below and one above this edge
							var anchors=getPrevAndNextAnchors();
							//calculate how much additional progress, beyond the start of the current step, has been made
							progPercent=getCurrentStepPercent();
							//move up to the next anchor
							if(anchors.next!=undefined){
								setProgressBarStep(anchors.next.attr('name'),progPercent); //*** set progress bar to progPercent % width inside this function
							}else{
								//move up to the prev anchor
								if(anchors.prev!=undefined){
									setProgressBarStep(anchors.prev.attr('name'),progPercent);
								}
							}
							//get the longer animation duration time (scroll animation or progress bar animation)
							var longerDelay=scrollAnimDelay;
							if(animDelay>longerDelay){longerDelay=animDelay;}
							//recursively check the alignment again to catch up with quick-scrolling
							clearTimeout(realign_timeout);
							realign_timeout = setTimeout(function(){
								//recursively align, if necessary (user scrolled while the previous animation was still running)
								alignProgressBarWithScroll();
							},longerDelay+100);
						}
					}else{
						//scroll animation already in progress.../
					}
				}
			};
			var scroll_timeout;
			jQuery(window).scroll(function(){
				//wait for scroll end
				clearTimeout(scroll_timeout);
				scroll_timeout = setTimeout(function(){
					//the progress bar should represent the current scroll position
					alignProgressBarWithScroll();
				}, 100);
			});
		});
	}
});
