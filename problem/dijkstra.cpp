#include <bits/stdc++.h>
#define mod 1000000007
#define pb push_back
#define mp make_pair
#define ff first
#define ss second

using namespace std;
int n, m;
vector<pair<int,int> > adj[100005];
bool vis[100005];
int path[100005];
void dijkstra(int s)
{
    priority_queue < pair < int , int > > pq;
    pq.push(mp(0, s));
    while(!pq.empty())
    {
        int u = pq.front().ss;
        int cost = -pq.front().ff;
        pq.pop();
        vis[u] = 1;
        path[u] = cost;
        for(int i = 0; i < adj[u].size(); i++)
        {
            int v = adj[u][i].ff;
            int e = adj[u][i].ss;
            if(!vis[v]) pq.push(mp(-(cost + e), v));
        }
        while(!pq.empty() && vis[pq.front().ss]) pq.pop();
    }
}
int main()
{
    int i, j;
    cin >> n >> m;
    while(m--){
        int u, v, e;
        /*zamaa unshij avj bna*/
        cin >> u >> v >> e;
        adj[u].pb(mp(v, e));
        adj[v].pb(mp(u, e));
    }
    dijkstra(1);
    for(i = 1; i <= n; i++) cout << path[i] << ' ';
    return 0;
}
