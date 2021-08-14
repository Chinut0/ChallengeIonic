
const axios = require('axios').default;

export interface iProducts {
    created_at: string,
    deleted_at: null | string,
    description: string,
    id: number,
    image: string,
    name: string,
    price: number,
    quantity: number,
    status: string,
}

interface message {
    message: string,
}

export class Services {
    async query(method: "get" | "post" | "put" | "delete", route: string, body?: any) {
        let token = localStorage.getItem('backToken')
        let url = process.env.REACT_APP_API_URL + 'api/' + route

        let config
        if (method === 'post') {
            config = {
                method: method,
                url: url,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
                data: body
            }
        } else {
            config = {
                method: method,
                url: url,
                headers: { 'Authorization': 'Bearer ' + token },
            }
        }

        try {
            const response = await axios(config);
            return response.data
        } catch (e) {
            console.log(e);
        }

    }

    //Productos
    async queryPorducts(): Promise<iProducts[]> {
        const data = await this.query('get', 'products')
        return data
    }

    //Producto
    async queryProduct(id: string): Promise<iProducts | undefined> {
        const data = await this.query('get', 'products/' + id)
        return data
    }

    //Borrar
    async delete(id: number): Promise<void> {
        const data = await this.query('delete', 'products/' + id)
    }

    //Crear
    async create(formData: any): Promise<iProducts> {
        const data = await this.query('post', 'products', formData)
        return data
    }

    //Editar
    async update(formData: any, id: any): Promise<iProducts> {
        const data = await this.query('post', 'products/' + id, formData)
        return data
    }

    //Generar Back Token
    async generateToken(formData: any): Promise<string> {
        const data = await this.query('post', 'login', formData)
        return data.backToken
    }

    //Logout
    async logout(): Promise<message> {
        const data = await this.query('post', 'logout')
        return data
    }

    //Logged?
    async queryLogeado(): Promise<boolean> {
        const data = await this.query('get', 'logeado')
        return data.message
    }


}