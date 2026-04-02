#include <bits/stdc++.h>

using namespace std;
int n;
int a[100005];
int treemax[400005];
int treemin[400005];
void build(int id, int l, int r)
{
    if(l == r) {
        treemax[id] = a[l];
        treemin[id] = a[l];
        return ;
    }
    build(id * 2, l, (l + r) / 2);
    build(id * 2 + 1, (l + r) / 2 + 1, r);
    treemax[id] = max(treemax[id * 2], treemax[id * 2 + 1]);
    treemin[id] = min(treemin[id * 2], treemin[id * 2 + 1]);
}
int querymax(int id, int L, int R, int l, int r)
{
    if(R < l || r < L) return 0;
    if(l <= L && R <= r) return treemax[id];
    return max(querymax(id * 2, L, (L + R) / 2, l, r), querymax(id * 2 + 1, (L + R) / 2 + 1, R, l, r));
}
int querymin(int id, int L, int R, int l, int r)
{
    if(R < l || r < L) return 1e9;
    if(l <= L && R <= r) return treemin[id];
    return min(querymin(id * 2, L, (L + R) / 2, l, r), querymin(id * 2 + 1, (L + R) / 2 + 1, R, l, r));
}
int main(){
    int Q;
    cin >> n >> Q;
    int i, j;
    for(i = 1; i <= n; i++) cin >> a[i];
    build(1, 1, n);
    while(Q--)
    {
        int l, r;
        cin >> l >> r;
        cout << querymax(1, 1, n, l, r) - querymin(1, 1, n, l, r) << '\n';
    }
    return 0;
    
}
