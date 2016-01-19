
// Save me from typing all the reference links and numbers by inserting them programmatically

function refElem(text, link) {
	return (function(t,l){
		return function() {
			e = document.createElement('a');
			e.innerHTML=t;
			e.setAttribute('href', l);
			return e;
		};
	})(text,link)
};

d3.selectAll(".reference.isdals").insert( refElem('[1]', "#cite_isdals"), ":first-child" );
d3.selectAll(".reference.speizer79").insert( refElem('[2]', "#cite_speizer1979"), ":first-child" );

//~ function(){var t = document.createElement('text'); t.innerHTML='hej'; this.parentNode.insertBefore(t, this.nextSibling);}


//~ function rE(t,l){
	//~ return function() {
		//~ e = document.createElement('a');
		//~ e.innerHTML=t;
		//~ e.setAttribute('href', l);
		//~ this.insertBefore(e, this.childNodes[0]);
	//~ }
//~ };
