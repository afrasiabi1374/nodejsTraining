import nunjucks from 'nunjucks';

export function alertDangerExtension() {
    this.tags = ['AlertDanger'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endAlertDanger');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args,[body]);
    };

    this.run = function(context,key,body) {
        try{
            const msg = context?.ctx?.settings?.req?.query?.msg ?? '';
            if(msg === key)
            {
                const html = `
                    <div class="text-center alert alert-danger">${body()}</div>
                `;
                return nunjucks.runtime.markSafe(html);
            }    
        }
        catch(e){
            return e.toString();
        }
    };
}


export function alertSuccessExtension() {
    this.tags = ['AlertSuccess'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endAlertSuccess');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args,[body]);
    };

    this.run = function(context,key,body) {
        try{
            const msg = context?.ctx?.settings?.req?.query?.msg ?? '';
            if(msg === key)
            {
                const html = `
                    <div class="text-center alert alert-success">${body()}</div>
                `;
                return nunjucks.runtime.markSafe(html);
            }    
        }
        catch(e){
            return e.toString();
        }
    };
}