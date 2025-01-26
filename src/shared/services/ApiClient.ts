export class APIClient {
    private abortControllers: Map<string, AbortController>;
  
    constructor() {
      this.abortControllers = new Map();
    }
  
    async request(url: string, options: RequestInit = {}, requestKey: string) {
      // Cancel any existing request with the same key
      if (this.abortControllers.has(requestKey)) {
        this.abortControllers.get(requestKey)?.abort();
      }
  
      // Create a new AbortController for the new request
      const controller = new AbortController();
      const signal = controller.signal;
      this.abortControllers.set(requestKey, controller);
  
      try {
        const response = await fetch(url, { ...options, signal });
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log(`Request "${requestKey}" was aborted.`);
        } else {
          throw error;
        }
      } finally {
        this.abortControllers.delete(requestKey);
      }
    }
  }
  
  export const apiClient = new APIClient();
  