!function(){var s=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e.imageViewer=s(function(s,e,n,i,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.helpers),a=a||{};var p,l="",r="function",t=this.escapeExpression;return l+='<div id="ib-img-preview" class="ib-preview">\n    <img src="'+t((p=e&&e.src,typeof p===r?p.apply(e):p))+'" class="ib-preview-img"/>\n    <span class="ib-preview-descr" style="display:none;">'+t((p=e&&e.description,typeof p===r?p.apply(e):p))+'</span>\n    <div class="ib-nav" style="display:none;">\n        <span class="ib-nav-prev">Previous</span>\n        <span class="ib-nav-next">Next</span>\n    </div>\n    <span class="ib-close" style="display:none;">Close Preview</span>\n    <div class="ib-loading-large" style="display:none;">Loading...</div>\n</div>\n'})}();