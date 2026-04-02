/**
 * https://www.spoj.com/problems/QTREE2/
 * 07.04.2019 11:03:49
**/
#include <bits/stdc++.h>
#define pb push_back
#define mp make_pair
#define ff first
#define ss second

using namespace std;

vector<pair<int,int> > adj[10001];
int n, E, a[20001][20];
int p[20001], L[20001], path[10001];

void dfs(int u , int x , int level , int cost){
    p[u] = x;
    L[u] = level;
    path[u] = cost;
    for(int i = 0 ; i < adj[u].size() ; i++) {
        int v = adj[u][i].ff;
        int e = adj[u][i].ss;
        if(v != x) dfs(v , u , level + 1 , cost + e);
    }
}

int query(int u, int v){
    if(L[v] < L[u]) swap(u, v);
    for(int i = 15 ; i >= 0 ; i--) {
        if(L[v] - (1 << i) >= L[u]) v = a[v][i];
    }
    if(u == v) return u;
    for(int i = 15 ; i >= 0 ; i--){
        if(a[v][i] != a[u][i]) {
            u = a[u][i];
            v = a[v][i];
        }
    }
    return p[u];
}

void solve(){
    for(int i = 1 ; i <= n ; i++) a[i][0] = p[i];
    for(int j = 1 ; j <= 15 ; j++)
        for(int i = 1 ; i <= n ; i++){
            if(L[i] - (1 << j) >= 1) a[i][j] = a[a[i][j - 1]][j - 1];
        }
}

int query1(int u,int k){
    k = L[u] - k;
    for(int i = 15 ; i >= 0 ; i--)
        if(L[u] - (1 << i) >= k) u = a[u][i];
    return u;
}

int main(){
    int u, v, e, Q, t,x ,y, k, b, i;
    string st;
    cin >> t;
    while(t--){
        cin >> n;
        memset(p , 0 , sizeof(p));
        memset(a , 0 , sizeof(a));
        memset(L , 0 , sizeof(L));
        for(i = 1; i <= n; i++) adj[i].clear();
        for(i = 1 ; i < n ; i++){
            cin >> u >> v >> e;
            adj[u].pb(mp(v , e) );
            adj[v].pb(mp(u , e) );
        }
        dfs(1, 0, 1, 0);
        solve();
        while(cin >> st && st != "DONE"){
            if(st == "DIST") {
                cin >> x >> y;
                u = query(x , y);
                cout << path[x] + path[y] - 2 * path[u] << endl;
            }
            else{
                cin >> x >> y >> k;
                u = query(x , y);
                if(L[x] - L[u] + 1 >= k) {
                    k--;
                    cout << query1(x , k) << endl;
                }
                else{
                    k -= (L[x] - L[u] + 1);
                    k = L[y] - L[u] - k;
                    cout << query1(y , k) << endl;
                }
            }
        }
    }
}
