import API_CONFIG from '../config/api';

/**
 * Interceptor de API que adiciona o token JWT automaticamente em requisições
 */
class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Obtém o token do localStorage
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Realiza uma requisição com tratamento de erros
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Adiciona token se existir
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        timeout: API_CONFIG.TIMEOUT,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Se token expirou, remove do localStorage
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          // Opcionalmente redirecionar para login
          window.dispatchEvent(new Event('unauthorized'));
        }
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return { success: true, data, status: response.status };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        status: null 
      };
    }
  }

  /**
   * Requisição GET
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Requisição POST
   */
  async post(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Requisição PUT
   */
  async put(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * Requisição DELETE
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Requisição PATCH
   */
  async patch(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}

export default new APIClient();
