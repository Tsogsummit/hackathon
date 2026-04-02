#include <bits/stdc++.h>
#define mp make_pair
#define ff first
#define ss second
#define pb push_back

using namespace std;
vector<int> tree[4000005];

int a[1000005];
int b[1000005];
int c[1000005];
int p[1000005];
void update(int x, int y)
{
    while(x <= 1e6){
        p[x] += y;
        x += (x & (-x)) ;
    }
}
int query(int x)
{
    int res=  0;
    while(x > 0) {
        res += p[x];
        x -= (x & (-x));
    }
    return res;
}
int n;
map<int, int > x;
int main() {
    int i, j;
    scanf("%d",&n);
    for(i = 1; i <= n; i++) scanf("%d",&a[i]);
    for(i = 1; i <= n; i++) {
        x[a[i]]++;
        b[i] = x[a[i]];
    }
    x.clear();
    for(i = n; i >= 1; i--) {
        x[a[i]]++;
        c[i] = x[a[i]];
    }
    long long res = 0;
    for(i = 1; i <= n; i++) update(c[i], 1);
    for(i = 1; i <= n; i++) {
        update(c[i], -1);
        res += query(b[i] - 1);
    }
    cout << res;
    return 0;
}

