#include <bits/stdc++.h>

using namespace std;
int adj[505][505] = {0}, n, m;
void floyd()
{for(int k = 0; k < n; k++)
    for(int u = 0; u < n; u++)
        for(int v = 0; v < n; v++)
            if (u != v && adj[u][k] > 0 && adj[k][v] > 0)
                if (adj[u][v] == 0 || adj[u][v] > adj[u][k] + adj[k][v])
                    adj[u][v] = adj[u][k] + adj[k][v];
}
int main()
{
    int u , v , l;
    int min = 50000000, t = -1;
    cin >> n >> m;
    while(m--)
    {
        cin >> u >> v >> l;
        if(adj[u][v] > l || adj[u][v] == 0)
        {
            adj[u][v] = l;
        }
        if(adj[v][u] > l || adj[v][u] == 0)
        {
            adj[v][u] = l;
        }
    }
    floyd();
    for(int i = 0; i < n; i++)
    { int max1 = 0;
        for(int j = 0; j < n; j++)  if(adj[i][j] > max1) max1 = adj[i][j];
        //cout<<max1<<endl;
        if(max1 < min) {
            min = max1;
            t = i;
        }
    }
    if(min == 0) cout<<"-1";
    else cout<<t;
}
