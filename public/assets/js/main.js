/**
 * Main Template
 */
const desktop = isDesktop();
var main = {
    data() {
        return {
            collapsed: desktop
        }
    },
    methods: {
        collapse: function(){
            this.collapsed = !this.collapsed;
        }
    }
};
function isDesktop()
{
    return window.innerWidth > 993;
}