
// Save me from typing all the reference links and numbers by inserting them programmatically (before any text in the span element)

function refElem(text, link) {
	return (function(t,l){
		return function() {
			var myText = '<a href="' + l + '">' + t + '</a>' + (this.childNodes.length == 0? '': ' '); // add a space if it was non-empty
			this.insertAdjacentHTML('afterbegin', myText);
		};
	})(text,link)
};

d3.selectAll(".reference.isdals").each( refElem('[1]', "#cite_isdals") );
d3.selectAll(".reference.speizer79").each( refElem('[2]', "#cite_speizer1979") );
