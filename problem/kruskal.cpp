#include <bits/stdc++.h>
#define pb push_back
#define mp make_pair
#define ff first
#define ss second

using namespace std;
int n, m;
vector<pair<int, pair<int,int > > > edges;
int p[100005];

int find(int x){
    if(x == p[x]) return x;
    return p[x] = find(p[x]);
}

bool Union_find(int x, int y){
    int u = find(x);
    int v = find(y);
    if(v > u) swap(u, v);
    if(u != v){
        p[u] = v;
        return 1;
    }
    return 0;
}

int main() {
    int i, j;
    cin >> n >> m;
    for(i = 1; i <= n; i++) p[i] = i;
    for(i = 1; i <= m; i++)
    {
        int u, v, e;
        cin >> u >> v >> e;
        if(v > u) swap(u, v);
        edges.pb(mp(e, mp(u, v)));
    }
    int res = 0;
    sort(edges.begin(),edges.end());
    for(i = 0; i < edges.size(); i++)
    {   
        int u = edges[i].ss.ff;
        int v = edges[i].ss.ss;
        int e = edges[i].ff;
        if(Union_find(u, v)){
            res += e;
        }
    }
    cout << res;
    return 0;
}
