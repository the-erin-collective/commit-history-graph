export interface ResponseEventCommit { 
    author: { 
        email: string 
    }; 
    actor: { 
        login: string 
    };
}

export interface ResponseEvent {
    type: string; 
    payload: { 
        commits: ResponseEventCommit[] | null 
    } | null; 
    created_at: string 
}
