/**
 * @name NoReplyPing
 * @description Automatically sets replies to not ping the target.
 * @author Qb
 * @authorId 133659541198864384
 * @authorLink https://github.com/BleedingBD/
 * @version 1.0.1
 * @invite gj7JFa6mF8
 * @source https://github.com/BleedingBD/plugin-NoReplyPing/blob/main/NoReplyPing.plugin.js
 * @updateUrl https://raw.githubusercontent.com/BleedingBD/plugin-NoReplyPing/main/NoReplyPing.plugin.js
 */
module.exports = class NoReplyPing {
    constructor(meta) {
        this.meta = meta;
        this.api = new BdApi(meta.name);

        const { Filters } = this.api.Webpack;
        this.replyBar = this.getModuleAndKey(Filters.byStrings('type:"CREATE_PENDING_REPLY"'));
    }

    getModuleAndKey(filter) {
        const { getModule } = this.api.Webpack;
        let module;
        const value = getModule((e, m) => (filter(e) ? (module = m) : false), { searchExports: true });
        if (!module) return;
        return [module.exports, Object.keys(module.exports).find((k) => module.exports[k] === value)];
    }

    start() {
        if (!this.replyBar) {
            console.error(`${this.meta.name}: Unable to start because the reply bar module could not be found.`);
            return;
        }

        const { Patcher } = this.api;
        Patcher.before(...this.replyBar, (_thisArg, [props]) => {
            props.shouldMention = false;
        });
    }

    stop() {
        const { Patcher } = this.api;
        Patcher.unpatchAll();
    }
};
