class Store {
    set(key, value) {
        // set LocalStorage key/value
        localStorage.setItem(key, value);
    }

    // Get current user
    get(key) {
        return localStorage.getItem(key);
    }

    // Remove current user
    remove(key) {
        localStorage.removeItem(key);
    }

    // Clear all keys
    clearAll() {
        localStorage.clear();
    }

    // Loop over all stored values
    each(callback) { 
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            callback(key, this.get(key));
        }
    }
}

let store = new Store();

export { store };