/*
 *https://www.spoj.com/HOME/problems/ULB201503/
 *2018-04-29 07:32:40
*/

#include <bits/stdc++.h>

using namespace std;

int tree[4000005];
int a[500005];
bool pos[4000005];

void build(int id,int l, int r){
    if(l > r) return ;
    if(l == r){
        tree[id] = a[l];
        return ;
    }
    build(id * 2 , l , (l + r) / 2);
    build(id * 2 + 1 , (l + r) / 2 + 1 , r);
    tree[id] = tree[id * 2] + tree[id * 2 + 1];
}

void update(int id , int l , int r , int L , int R){
    if(pos[id]){
        tree[id] = (R - L + 1) - tree[id];
        pos[id * 2] ^= 1;
        pos[id * 2 + 1] ^= 1;
        pos[id] ^= 1;
    }
    if(r < L || l > R) return ;
    if(l <= L && r >= R) {
        tree[id] = (R - L + 1) - tree[id];
        pos[id * 2] ^= 1;
        pos[id * 2 + 1] ^= 1;
        return ;
    }
    int M = (L + R) / 2;
    update(id * 2 , l , r , L , M);
    update(id * 2 + 1 , l , r , M + 1 , R);
    tree[id] = tree[id * 2] + tree[id * 2 + 1];
}

int query(int id , int l , int r , int L , int R){
    if(pos[id]){
        tree[id] = (R - L + 1) - tree[id];
        pos[id * 2] ^= 1;
        pos[id * 2 + 1] ^= 1;
        pos[id] ^= 1;
    }
    if(l > R || r < L) return 0;
    if(l <= L && r >= R) return tree[id];
    return query(id * 2 , l , r , L , (L + R) / 2) + query(id * 2 + 1 , l , r , (L + R) / 2 + 1 , R);
}

int main(){
    memset(pos, 0, sizeof(pos));
    int n, q;
    cin >> n;
    for(int i = 1 ; i <= n ; i++)  cin >> a[i];
    build(1 , 1 , n);
    cin >> q;
    while(q--){
        int t , l , r;
        cin >> t >> l >> r;
        if(t == 0) update(1 , l , r , 1 , n);
        else cout << query(1 , l , r , 1 , n) << '\n';
    }
}
