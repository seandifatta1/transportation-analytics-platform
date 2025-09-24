export class BaseService {
    constructor(name) {
        this.name = name;
        this.initialized = false;
    }

    async initialize() {
        this.initialized = true;
        console.log(`${this.name} initialized`);
    }

    async destroy() {
        this.initialized = false;
        console.log(`${this.name} destroyed`);
    }

    isInitialized() {
        return this.initialized;
    }
}

export default BaseService;