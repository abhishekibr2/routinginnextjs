import { createClient } from "@/app/utils/supabase/client";
import { ApiResponse } from "@/responses/ApiResponses";

export async function GetUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser();
    return user && user.id;
}


export async function InsertPage<T>(rowData: any): Promise<ApiResponse> {
    console.log(rowData)
    try {
        const supabase = createClient()
        const { data, error } = await supabase.from("Pages").insert(rowData).select('*')
        if (error) throw error
        if (!data) {
            throw new Error('No data returned from Supabase after insert');
        }
        return {
            data: data,
            status: 200,
            message: 'Data added successfully'
        };
    } catch (error) {
        console.error('Error adding row:', error);
        throw error;
    }
}

export async function UpdatePage<T>(rowData: any): Promise<ApiResponse> {
    try {
        const supabase = createClient()
        const { data, error } = await supabase.from("Pages").update(rowData).eq('id', rowData.id).select('*')

        if (error) throw error
        if (!data) {
            throw new Error('No data returned from Supabase after update');
        }

        return {
            data: data,
            status: 200,
            message: 'Data updated successfully'
        };
    } catch (error) {
        console.error('Error updating row:', error);
        throw error;
    }
}

export async function GetPages<T>(): Promise<ApiResponse> {
    try {
        const supabase = createClient()
        const { data, error } = await supabase.from("Pages").select('*')

        if (error) throw error

        return {
            data: data,
            status: 200,
            message: 'Data Fetched successfully'
        };
    } catch (error) {
        console.error('Error adding row:', error);
        throw error;
    }
}

export async function GetPage<T>(id: string): Promise<ApiResponse> {
    try {
        const supabase = createClient()
        const { data, error } = await supabase.from("Pages").select('*').eq('id', id).maybeSingle()
        if (error) throw error
        console.log({ data })
        return {
            data: data,
            status: 200,
            message: 'Data Fetched successfully'
        };
    } catch (error) {
        console.log(error)
        console.error('Error adding row:', error);
        throw error;
    }
}

export async function GetPageUsingURL<T>(url: string): Promise<ApiResponse> {
    try {
        const supabase = createClient()
        const { data, error } = await supabase.from("Pages").select('*').eq('page_url', url).maybeSingle()
        if (error) throw error
        console.log({ data })
        return {
            data: data,
            status: 200,
            message: 'Data Fetched successfully'
        };
    } catch (error) {
        console.log(error)
        console.error('Error adding row:', error);
        throw error;
    }
}